import {IbadGrpcClient} from '@pub.ibad.one/ibad-grpc';


export default (gRPC: IbadGrpcClient) => {
  const svc_stub = gRPC.addService('blog.BlogService');

  return class BlogService {
    @svc_stub.unary_rpc(true)
    static async listBlog(r: any){ return r.blog; }

    @svc_stub.unary_rpc(true)
    static async getBlog(r: any){ return r.blog; }

    @svc_stub.unary_rpc(true)
    static async createBlog(r: any){ return r.id; }

    @svc_stub.unary_rpc(true)
    static async updateBlog(r: any){ return r; }

    @svc_stub.unary_rpc(true)
    static async deleteBlog(r: any){ return r; }
  };
}