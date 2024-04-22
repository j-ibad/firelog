import {IbadGrpcClient} from '@pub.ibad.one/ibad-grpc';


export default (gRPC: IbadGrpcClient) => {
  const svc_stub = gRPC.addService('topic.TopicService');

  return class TopicService {
    @svc_stub.unary_rpc(true)
    static async listTopic(r: any){ return r.topic; }

    @svc_stub.unary_rpc(true)
    static async getTopic(r: any){ return r.topic; }

    @svc_stub.unary_rpc(true)
    static async createTopic(r: any){ return r.id; }

    @svc_stub.unary_rpc(true)
    static async updateTopic(r: any){ return r; }

    @svc_stub.unary_rpc(true)
    static async deleteTopic(r: any){ return r; }
  };
}