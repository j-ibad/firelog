import {IbadGrpcClient, IbadGrpClientCreds} from '@pub.ibad.one/ibad-grpc';


import BlogService_ from './services/BlogService';
import TopicService_ from './services/TopicService';
import PostService_ from './services/PostService';
import FileService_ from './services/FileService';


export function FireLogAPI(host: string, port: string|number,
  creds=IbadGrpClientCreds.createInsecure(),
  opts: any={}
){
  const gRPC = new IbadGrpcClient(host, port, creds, opts);
  return {
    BlogService: class BlogService extends BlogService_(gRPC) {},
    TopicService: class TopicService extends TopicService_(gRPC) {},
    PostService: class PostService extends PostService_(gRPC) {},
    FileService: class FileService extends FileService_(gRPC) {},
  }
};