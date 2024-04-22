import {gRPC} from '.';
import TopicModel from '../models/TopicModel';
import File from '../utils/File';
import type {firelog as fl} from '../@types/firelog';


@gRPC.addService('topic.TopicService')
export default class TopicService {
  @gRPC.unary_rpc
  listTopic({user, page, blog_id}: fl.topic.ListTopicArgs){
    const retv: fl.topic.ListTopicResp = {status: {code: 0}};
    const {topic: topic_list} = TopicModel.list_topic(user, page, blog_id);
    if(topic_list)  retv.topic = topic_list;
    return retv;
  }

  @gRPC.unary_rpc
  getTopic({user, blog_id, id}: fl.topic.GetTopicArgs){
    const retv: fl.topic.GetTopicResp = {status: {code: 0}};
    const {topic} = TopicModel.get_topic(user, blog_id, id);
    if(topic)  retv.topic = topic;
    return retv;
  }

  @gRPC.unary_rpc
  createTopic({user, blog_id, topic}: fl.topic.CreateTopicArgs){
    const retv: fl.topic.CreateTopicResp = {status: {code: 0}};
    const {id: topic_id, blog_id: blog_id_res} = TopicModel.create_topic(user, blog_id, topic);
    if(topic_id){
      retv.id = topic_id;
      // Create topic directory
      const topic_dir = TopicModel.resolve_dir(blog_id_res!, topic_id);
      File.mkdir(topic_dir);
    }
    return retv;
  }

  @gRPC.unary_rpc
  updateTopic({user, blog_id, topic}: fl.topic.UpdateTopicArgs){
    const retv: fl.topic.UpdateTopicResp = {status: {code: 0}};
    TopicModel.update_topic(user, blog_id, topic);
    return retv;
  }

  @gRPC.unary_rpc
  deleteTopic({user, blog_id, id}: fl.topic.DeleteTopicArgs){
    const retv: fl.topic.DeleteTopicResp = {status: {code: 0}};
    const {changes, topic} = TopicModel.delete_topic(user, blog_id, id);
    if(changes > 0){
      // Delete topic directory
      const topic_dir = TopicModel.resolve_dir(topic.blog_id!, id);
      File.rmdir(topic_dir);
    }
    return retv;
  }
}