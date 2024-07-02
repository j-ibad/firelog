import path from 'path';
import {IbadGrpcServer} from '@ibad.one/ibad-grpc';
import {APP_CONF} from '../utils/Config';

const PROTO_PATH = path.join(...APP_CONF?.grpc?.proto);
const GRPC_PROTO_OPTS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};


export const gRPC = new IbadGrpcServer({
  verbose: APP_CONF?.server?.verbose || 0,
  grpc: {
    proto: {
      path: PROTO_PATH,
      opts: GRPC_PROTO_OPTS
    }
  }
});


import '../services/BlogService';
import '../services/TopicService';
import '../services/PostService';
import '../services/FileService';