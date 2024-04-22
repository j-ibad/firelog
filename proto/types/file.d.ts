import type {bytes_t, base} from './base';


export namespace file {
  // [=== FILES ===]
  export interface File {
    path: string;
    body?: bytes_t;
    mime?: string;
  }
  export interface FileOp {
    op: string;
    file: File;
  }


  // Messages for FileService.ListFiles
  export interface ListFilesArgs extends base.Args_t {
    blog_id: bytes_t;
    post_id: bytes_t;
  }
  export interface ListFilesResp extends base.Resp_t {
    paths?: string[];
  }
  // Messages for FileService.GetFiles
  export interface GetFilesArgs extends base.Args_t {
    blog_id: bytes_t;
    post_id: bytes_t;
    paths?: string[];
  }
  export interface GetFilesResp extends base.Resp_t {
    files?: File[];
  }
  // Messages for FileService.UpdateFiles
  export interface UpdateFilesArgs extends base.Args_t {
    blog_id: bytes_t;
    post_id: bytes_t;
    file_ops?: FileOp[];
  }
  export interface UpdateFilesResp extends base.Resp_t {}
}