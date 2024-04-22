import {gRPC} from '.';
import FileModel from '../models/FileModel';
import type {firelog as fl} from '../@types/firelog';


@gRPC.addService('file.FileService')
export default class FileService {
  @gRPC.unary_rpc
  listFiles({user, blog_id, post_id}: fl.file.ListFilesArgs){
    const retv: fl.file.ListFilesResp = {status: {code: 0}};
    const {paths: paths} = FileModel.list_files(user, blog_id, post_id);
    if(paths)  retv.paths = paths;
    return retv;
  }

  @gRPC.unary_rpc
  getFiles({user, blog_id, post_id, paths}: fl.file.GetFilesArgs){
    const retv: fl.file.GetFilesResp = {status: {code: 0}};
    const {files} = FileModel.get_files(user, blog_id, post_id, paths||[]);
    if(files)  retv.files = files;
    return retv;
  }

  @gRPC.unary_rpc
  updateFiles({user, blog_id, post_id, file_ops}: fl.file.UpdateFilesArgs){
    const retv: fl.file.UpdateFilesResp = {status: {code: 0}};
    FileModel.update_files(user, blog_id, post_id, file_ops||[]);
    return retv;
  }
}