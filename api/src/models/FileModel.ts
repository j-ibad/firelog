import Logger from '../utils/Logger';
import PostModel from './PostModel';
import File from '../utils/File';
import type {firelog as fl} from '../@types/firelog';


export default class FileModel {
  // [=== Model CRUD Operations ===]
  static list_files(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, post_id: fl.bytes_t){
    const post_dir = FileModel.resolve_post_dir(user, blog_id, post_id);
    const retv = {
      paths: File.walk(post_dir)
    };
    return retv;
  }

  static get_files(user: fl.base.UserIdOpt, blog_id: fl.bytes_t,
    post_id: fl.bytes_t, paths: string[]
  ){
    const post_dir = FileModel.resolve_post_dir(user, blog_id, post_id);
    const retv = {
      files: File.get_files(post_dir, paths)
    };
    return retv;
  }

  static update_files(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, 
    post_id: fl.bytes_t, file_ops: fl.file.FileOp[]
  ){
    const post_dir = FileModel.resolve_post_dir(user, blog_id, post_id);
    const CB_OP_MAP: {[op_code: string]: ((dir: string, file: fl.file.File)=>void)} = {
      w: FileModel.write_file,
      d: FileModel.delete_file,
    };
    for(const file_op of file_ops){
      const op_code = file_op.op?.toLowerCase();
      const file_op_cb = CB_OP_MAP[op_code];
      file_op_cb(post_dir, file_op.file);
    }
  }


  // [Utility functions]
  static resolve_post_dir(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, post_id: fl.bytes_t){
    const {post: {topic_id}} = PostModel.get_post(user, blog_id, post_id);
    const post_dir = PostModel.resolve_dir(blog_id!, topic_id!, post_id);
    return post_dir;
  }

  static write_file(post_dir: string, file: fl.file.File){
    const file_path = file.path;
    const file_body = file.body!;
    File.write_file(post_dir, file_path, file_body);
  }

  static delete_file(post_dir: string, file: fl.file.File){
    const file_path = file.path;
    const file_body = file.body!;
    File.delete_file(post_dir, file_path, file_body);
  }


  // [=== Model initialization ===]
  static init(){
    Logger.log(3, '  Loading Model: File');
    // File Model has no Database table
  }
}