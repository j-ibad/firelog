import {IbadGrpcClient} from '@pub.ibad.one/ibad-grpc';


export default (gRPC: IbadGrpcClient) => {
  const svc_stub = gRPC.addService('file.FileService');

  return class FileService {
    @svc_stub.unary_rpc(true)
    static async listFiles(r: any){ return r.paths; }

    @svc_stub.unary_rpc(true)
    static async getFiles(r: any){ return r.files; }

    @svc_stub.unary_rpc(true)
    static async updateFiles(r: any){ return r; }
  };
}