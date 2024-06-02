import {IbadGrpcClient, IbadGrpcClientCreds} from '@pub.ibad.one/ibad-grpc';
import path from 'path';


import BlogService_ from './services/BlogService';
import TopicService_ from './services/TopicService';
import PostService_ from './services/PostService';
import FileService_ from './services/FileService';

// Resolve proto dir
const SELF_PKG_NAME = '@pub.ibad.one/firelog-node';
let SELF_ROOT_DIR = __dirname;
try {
  const module_entry = require.resolve(SELF_PKG_NAME);
  const module_dir = path.dirname(module_entry);
  SELF_ROOT_DIR = module_dir;
}catch(err){ SELF_ROOT_DIR = __dirname; }


const PROTO_PATH = path.join(SELF_ROOT_DIR, '..', 'proto', 'firelog.proto');
const FIRELOG_OPTS = {
  grpc: {proto: {path: PROTO_PATH}}
};


export function FireLogAPI(host: string, port: string|number,
  creds=IbadGrpcClientCreds.createInsecure(),
  opts_: any={}
){
  const opts = Object.assign(FIRELOG_OPTS, opts_);
  const gRPC = new IbadGrpcClient(host, port, creds, opts);
  return {
    BlogService: class BlogService extends BlogService_(gRPC) {},
    TopicService: class TopicService extends TopicService_(gRPC) {},
    PostService: class PostService extends PostService_(gRPC) {},
    FileService: class FileService extends FileService_(gRPC) {},
  }
};

export {IbadGrpcClientCreds};