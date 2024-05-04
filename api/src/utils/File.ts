import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

import {FIRELOG_DATA_DIR, try_mkdir} from '../utils/Config';

const PATH_BLACKLIST = ['..'];
const BLOG_DIR = path.join(FIRELOG_DATA_DIR, 'blog');
try_mkdir(BLOG_DIR);


export default class File {
  // [Path]
  static sanitize_path(req_path: string){
    const path_nodes = req_path.split('/');
    const sanitized_nodes = path_nodes.filter(n=>{
      return !PATH_BLACKLIST.includes(n);
    });
    const dst_path = path.join(...sanitized_nodes);
    return dst_path;
  }

  static resolve_path(...path_nodes: string[]){
    return path.resolve(BLOG_DIR, ...path_nodes);
  }

  // [Directory]
  static mkdir(...path_nodes: string[]){
    const dst_path = File.resolve_path(...path_nodes);
    try_mkdir(dst_path);
  }

  static rmdir(...path_nodes: string[]){
    const dst_path = File.resolve_path(...path_nodes);
    fs.rmSync(dst_path, {recursive: true, force: true});
  }

  static walk(dir_path: string, leaf: boolean=true){
    let retv = fs.readdirSync(dir_path, {recursive: true}) as string[];
    retv = retv.filter((v: string)=>{  // Filter results
      const sanitized_path = File.sanitize_path(v);
      const v_path = File.resolve_path(dir_path, sanitized_path);
      const lstat = fs.lstatSync(v_path);
      if(leaf && lstat.isDirectory()) return false;
      return true;
    });
    return retv;
  }

  // [File]
  static get_files(dir_path: string, paths: string[]){
    const retv = [];
    for(const file_path of paths){
      const sanitized_path = File.sanitize_path(file_path);
      const resolved_file_path = File.resolve_path(dir_path, sanitized_path);
      const file_body = fs.readFileSync(resolved_file_path);
      const file = {
        path: file_path,
        body: file_body,
        mime: mime?.lookup?.(file_path) || undefined,
      };
      retv.push(file);
    }
    return retv;
  }

  static write_file(root_path: string, path_: string, body: Buffer){
    const sanitized_path = File.sanitize_path(path_);
    const file_path = File.resolve_path(root_path, sanitized_path);
    const dir_path = path.dirname(file_path);
    try_mkdir(dir_path);
    fs.writeFileSync(file_path, body);
  }

  static delete_file(dir_path: string, path: string, body: Buffer){
    const sanitized_path = File.sanitize_path(path);
    const file_path = File.resolve_path(dir_path, sanitized_path);
    fs.rmSync(file_path);
  }
}