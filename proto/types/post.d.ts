import type {bytes_t, base} from './base';


export namespace post {
  // [=== POST ===]
  export interface Post {
    id?: bytes_t;
    topic_id: bytes_t;
    name: string;
  }


  // Messages for PostService.ListPost
  export interface ListPostArgs extends base.ListArgs_t {
    blog_id: bytes_t;
    topic_id: bytes_t;
  }
  export interface ListPostResp extends base.ListResp_t {
    post?: Post[];
  }
  // Messages for PostService.GetPost
  export interface GetPostArgs extends base.GetArgs_t {blog_id: bytes_t;}
  export interface GetPostResp extends base.GetResp_t {
    post?: Post;
  }
  // Messages for PostService.CreatePost
  export interface CreatePostArgs extends base.CreateArgs_t {
    blog_id: bytes_t;
    post: Post;
  }
  export interface CreatePostResp extends base.CreateResp_t {}
  // Messages for PostService.UpdatePost
  export interface UpdatePostArgs extends base.UpdateArgs_t {
    blog_id: bytes_t;
    post: Post;
  }
  export interface UpdatePostResp extends base.UpdateResp_t {}
  // Messages for PostService.DeletePost
  export interface DeletePostArgs extends base.DeleteArgs_t {blog_id: bytes_t;}
  export interface DeletePostResp extends base.DeleteResp_t {}

  // Messages for PostService.NameToPostUri
  export interface NameToPostUriArgs extends base.Args_t {
    blog_id: bytes_t;
    uri: string;
  }
  export interface NameToPostUriResp extends base.Resp_t {id?: bytes_t;}
}