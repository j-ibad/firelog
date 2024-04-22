export type bytes_t = Buffer;


export namespace base {
  // [=== Utilities ===]
  export interface Empty {}

  export interface Status {
    code: number;
    msg?: string;
  }

  export interface Page {
    pg?: number;
    sz?: number;
  }
  export type PageOpt = Page | undefined;

  export interface UserId {
    uid?: bytes_t;
    gid?: bytes_t[];
  }
  export type UserIdOpt = UserId | undefined;


  // Inheritance base templates
  export interface Args_t {
    user?: UserId;
  }
  export interface Resp_t {
    status: base.Status;
  }
  // Inheritance CRUD templates
  //  List
  export interface ListArgs_t extends Args_t {page?: Page;}
  export interface ListResp_t extends Resp_t {}
  //  Get
  export interface GetArgs_t extends Args_t {id: bytes_t;}
  export interface GetResp_t extends Resp_t {}
  //  Create
  export interface CreateArgs_t extends Args_t {}
  export interface CreateResp_t extends Resp_t {id?: bytes_t;}
  //  Update
  export interface UpdateArgs_t extends Args_t {}
  export interface UpdateResp_t extends Resp_t {}
  //  Delete
  export interface DeleteArgs_t extends Args_t {id: bytes_t;}
  export interface DeleteResp_t extends Resp_t {}
}