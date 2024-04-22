import type {bytes_t, base} from './base';


export namespace topic {
  // [=== TOPIC ===]
  export interface Topic {
    id?: bytes_t;
    blog_id: bytes_t;
    name: string;
  }


  // Messages for TopicService.ListTopic
  export interface ListTopicArgs extends base.ListArgs_t {blog_id: bytes_t;}
  export interface ListTopicResp extends base.ListResp_t {
    topic?: Topic[];
  }
  // Messages for TopicService.GetTopic
  export interface GetTopicArgs extends base.GetArgs_t {blog_id: bytes_t;}
  export interface GetTopicResp extends base.GetResp_t {
    topic?: Topic;
  }
  // Messages for TopicService.CreateTopic
  export interface CreateTopicArgs extends base.CreateArgs_t {
    blog_id: bytes_t;
    topic: Topic;
  }
  export interface CreateTopicResp extends base.CreateResp_t {}
  // Messages for TopicService.UpdateTopic
  export interface UpdateTopicArgs extends base.UpdateArgs_t {
    blog_id: bytes_t;
    topic: Topic;
  }
  export interface UpdateTopicResp extends base.UpdateResp_t {}
  // Messages for TopicService.DeleteTopic
  export interface DeleteTopicArgs extends base.DeleteArgs_t {blog_id: bytes_t;}
  export interface DeleteTopicResp extends base.DeleteResp_t {}
}