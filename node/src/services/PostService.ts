import {IbadGrpcClient} from '@ibad.one/ibad-grpc';


export default (gRPC: IbadGrpcClient) => {
  const svc_stub = gRPC.addService('post.PostService');

  return class PostService {
    @svc_stub.unary_rpc(true)
    static async listPost(r: any){ return r.post; }

    @svc_stub.unary_rpc(true)
    static async getPost(r: any){ return r.post; }

    @svc_stub.unary_rpc(true)
    static async createPost(r: any){ return r.id; }

    @svc_stub.unary_rpc(true)
    static async updatePost(r: any){ return r; }

    @svc_stub.unary_rpc(true)
    static async deletePost(r: any){ return r; }


    @svc_stub.unary_rpc(true)
    static async nameToPostUri(r: any){ return r.id; }
  };
}