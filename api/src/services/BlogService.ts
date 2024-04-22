import {gRPC} from '../services';
import BlogModel from '../models/BlogModel';
import File from '../utils/File';
import type {firelog as fl} from '../@types/firelog';


@gRPC.addService('blog.BlogService')
export default class BlogService {
  @gRPC.unary_rpc
  listBlog({user, page}: fl.blog.ListBlogArgs){
    const retv: fl.blog.ListBlogResp = {status: {code: 0}};
    const {blog: blog_list} = BlogModel.list_blog(user, page);
    if(blog_list)  retv.blog = blog_list;
    return retv;
  }

  @gRPC.unary_rpc
  getBlog({user, id}: fl.blog.GetBlogArgs){
    const retv: fl.blog.GetBlogResp = {status: {code: 0}};
    const {blog} = BlogModel.get_blog(user, id);
    if(blog)  retv.blog = blog;
    return retv;
  }

  @gRPC.unary_rpc
  createBlog({user, blog}: fl.blog.CreateBlogArgs){
    const retv: fl.blog.CreateBlogResp = {status: {code: 0}};
    const {id: blog_id} = BlogModel.create_blog(user, blog);
    if(blog_id){
      retv.id = blog_id;
      // Create blog directory
      const blog_dir = BlogModel.resolve_dir(blog_id);
      File.mkdir(blog_dir);
    }
    return retv;
  }

  @gRPC.unary_rpc
  updateBlog({user, blog}: fl.blog.UpdateBlogArgs){
    const retv: fl.blog.UpdateBlogResp = {status: {code: 0}};
    BlogModel.update_blog(user, blog);
    return retv;
  }

  @gRPC.unary_rpc
  deleteBlog({user, id}: fl.blog.DeleteBlogArgs){
    const retv: fl.blog.DeleteBlogResp = {status: {code: 0}};
    const op_res = BlogModel.delete_blog(user, id);
    if(op_res > 0){
      // Delete blog directory
      const blog_dir = BlogModel.resolve_dir(id);
      File.rmdir(blog_dir);
    }
    return retv;
  }
}