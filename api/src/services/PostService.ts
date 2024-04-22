import {gRPC} from '.';
import PostModel from '../models/PostModel';
import File from '../utils/File';
import type {firelog as fl} from '../@types/firelog';


@gRPC.addService('post.PostService')
export default class PostService {
  @gRPC.unary_rpc
  listPost({user, page, blog_id, topic_id}: fl.post.ListPostArgs){
    const retv: fl.post.ListPostResp = {status: {code: 0}};
    const {post: post_list} = PostModel.list_post(user, page, blog_id, topic_id);
    if(post_list)  retv.post = post_list;
    return retv;
  }

  @gRPC.unary_rpc
  getPost({user, blog_id, id}: fl.post.GetPostArgs){
    const retv: fl.post.GetPostResp = {status: {code: 0}};
    const {post} = PostModel.get_post(user, blog_id, id);
    if(post)  retv.post = post;
    return retv;
  }

  @gRPC.unary_rpc
  createPost({user, blog_id, post}: fl.post.CreatePostArgs){
    const retv: fl.post.CreatePostResp = {status: {code: 0}};
    const {id: post_id, topic_id} = PostModel.create_post(user, blog_id, post);
    if(post_id){
      retv.id = post_id;
      // Create post directory
      const post_dir = PostModel.resolve_dir(blog_id!, topic_id!, post_id);
      File.mkdir(post_dir);
    }
    return retv;
  }

  @gRPC.unary_rpc
  updatePost({user, blog_id, post}: fl.post.UpdatePostArgs){
    const retv: fl.post.UpdatePostResp = {status: {code: 0}};
    PostModel.update_post(user, blog_id, post);
    return retv;
  }

  @gRPC.unary_rpc
  deletePost({user, blog_id, id}: fl.post.DeletePostArgs){
    const retv: fl.post.DeletePostResp = {status: {code: 0}};
    const {changes, post} = PostModel.delete_post(user, blog_id, id);
    if(changes > 0){
      // Delete post directory
      const post_dir = PostModel.resolve_dir(blog_id!, post!.topic_id, id);
      File.rmdir(post_dir);
    }
    return retv;
  }


  @gRPC.unary_rpc
  nameToPostUri({user, blog_id, uri}: fl.post.NameToPostUriArgs){
    const retv: fl.post.NameToPostUriResp = {status: {code: 0}};
    const {id: post_id} = PostModel.uri_to_id(blog_id, uri);
    if(post_id)  retv.id = post_id;
    return retv;
  }
}