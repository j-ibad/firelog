import type {bytes_t, base} from './base.d.ts';


export namespace blog {
  // [=== BLOG ===]
  export interface Blog {
    id?: bytes_t;
    name: string;
    owner_id?: bytes_t;
    owner_type?: string;
  }


  // Messages for BlogService.ListBlog
  export interface ListBlogArgs extends base.ListArgs_t {}
  export interface ListBlogResp extends base.ListResp_t {
    blog?: Blog[];
  }
  // Messages for BlogService.GetBlog
  export interface GetBlogArgs extends base.GetArgs_t {}
  export interface GetBlogResp extends base.GetResp_t {
    blog?: Blog;
  }
  // Messages for BlogService.CreateBlog
  export interface CreateBlogArgs extends base.CreateArgs_t {
    blog: Blog;
  }
  export interface CreateBlogResp extends base.CreateResp_t {}
  // Messages for BlogService.UpdateBlog
  export interface UpdateBlogArgs extends base.UpdateArgs_t {
    blog: Blog;
  }
  export interface UpdateBlogResp extends base.UpdateResp_t {}
  // Messages for BlogService.DeleteBlog
  export interface DeleteBlogArgs extends base.DeleteArgs_t {}
  export interface DeleteBlogResp extends base.DeleteResp_t {}
}