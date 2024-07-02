import Logger from '../utils/Logger';
import {FireLogDB} from '../utils/Persistence';
import File from '../utils/File';
import URI from '../utils/URI';
import type {firelog as fl} from '../@types/firelog';


export default class PostModel {
  // [=== Model CRUD Operations ===]
  static list_post(user: fl.base.UserIdOpt, page: fl.base.PageOpt, 
    blog_id: fl.bytes_t, topic_id: fl.bytes_t
  ){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      SELECT P.id, P.name, P.payload, P.topic_id, P.uri
      FROM Post P
      WHERE P.blog_id=? AND P.topic_id=?
    `);
    const post = sql_query.all(blog_id, topic_id) as fl.post.Post[];
    const retv = {post: post};
    firelog_db.db?.close();
    return retv;
  }

  static get_post(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, id: fl.bytes_t){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      SELECT P.id, P.name, P.payload, P.topic_id, P.blog_id
      FROM Post AS P
      WHERE P.blog_id=? AND P.id=?
    `);
    const post = sql_query.get(blog_id, id) as fl.post.Post;
    const retv = {post: post};
    firelog_db.db?.close();
    return retv;
  }

  static create_post(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, post: fl.post.Post){
    const firelog_db = new FireLogDB();
    const new_id = FireLogDB.uuid();
    const sql_query = firelog_db.db!.prepare(`
      INSERT OR IGNORE INTO Post (id, name, payload, uri, topic_id, blog_id)
      SELECT ? id, ? name, ? payload, ? uri, ? topic_id, ? blog_id
      WHERE EXISTS (SELECT * FROM Topic T WHERE T.id=? AND T.blog_id=?)
    `);
    const topic_id = post.topic_id;
    const post_uri = URI.str_to_uri(post.name);
    const sql_res = sql_query.run(new_id, post.name, post.payload ?? null, 
      post_uri, topic_id, blog_id, topic_id, blog_id);
    const is_inserted = sql_res.changes > 0;
    const retv = {
      id: is_inserted ? new_id : undefined,
      topic_id: is_inserted ? topic_id : undefined
    };
    firelog_db.db?.close();
    return retv;
  }

  static update_post(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, post: fl.post.Post){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      UPDATE Post 
      SET name=?, payload=?, uri=?, topic_id=IFNULL(?, topic_id), blog_id=?
      WHERE blog_id=? AND id=?
    `);
    const topic_id = post.topic_id;
    const post_uri = URI.str_to_uri(post.name);
    const sql_res = sql_query.run(post.name, post.payload ?? null, post_uri, 
      topic_id, blog_id, blog_id, post.id!);
    const retv = {changes: sql_res.changes};
    firelog_db.db?.close();
    return retv;
  }

  static delete_post(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, id: fl.bytes_t){
    // Prefetch existing post data
    const {post: post_data} = PostModel.get_post(user, blog_id, id);
    // Proceed with Post deletion
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      DELETE FROM Post WHERE blog_id=? AND id=?
    `);
    const sql_res = sql_query.run(blog_id, id);
    const retv = {
      changes: sql_res.changes,
      post: post_data
    };
    firelog_db.db?.close();
    return retv;
  }


  // [Search Operations]
  static uri_to_id(blog_id: fl.bytes_t, uri: string){
    const retv: {id?: Buffer} = {};
    const firelog_db = new FireLogDB();
    let uri_id = Buffer.from('');
    try {  // Try to decode uri as 
      const uri_id_try = Buffer.from(uri, 'base64url');
      if(uri_id_try.length == 16){  // Is a UUID (16 Bytes)
        uri_id = uri_id_try;
      }
    }catch(b64_err){}

    const sql_query = firelog_db.db!.prepare(`
      SELECT Post.id FROM Post 
      WHERE (Post.blog_id=? AND Post.uri=?)
        OR (Post.id=? AND Post.blog_id=?)
    `);
    const sql_res = sql_query.get(blog_id, uri, uri_id, blog_id) as {id: fl.bytes_t};
    retv.id = sql_res?.id;
    firelog_db.db?.close();
    return retv;
  }


  // [Utility functions]
  static resolve_dir(blog_id: fl.bytes_t, topic_id: fl.bytes_t, post_id: fl.bytes_t){
    const blog_id64 = blog_id.toString('base64url');
    const topic_id64 = topic_id.toString('base64url');
    const post_id64 = post_id.toString('base64url');
    return File.resolve_path(blog_id64, topic_id64, post_id64);
  }


  // [=== Model initialization ===]
  static init(){
    Logger.log(3, '  Loading Model: Post');
    const firelog_db = new FireLogDB();
    firelog_db.db?.exec(`
      CREATE TABLE IF NOT EXISTS Post (
        id BLOB PRIMARY KEY,
        name TEXT NOT NULL,
        payload TEXT NULL,
        uri TEXT NOT NULL,
        topic_id BLOB NOT NULL REFERENCES Topic(id),
        blog_id BLOB NOT NULL REFERENCES Blog(id),
        UNIQUE (blog_id, uri)
      );
    `);
    firelog_db.db?.close();
  }
}