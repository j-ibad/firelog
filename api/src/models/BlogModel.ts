import Logger from '../utils/Logger';
import {FireLogDB} from '../utils/Persistence';
import File from '../utils/File';
import type {firelog as fl} from '../@types/firelog';


export default class BlogModel {
  // [=== Model CRUD Operations ===]
  static list_blog(user: fl.base.UserIdOpt, page: fl.base.PageOpt){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      SELECT id, name FROM Blog
    `);
    const blog = sql_query.all() as fl.blog.Blog[];
    const retv = {blog: blog};
    firelog_db.db?.close();
    return retv;
  }

  static get_blog(user: fl.base.UserIdOpt, id: fl.bytes_t){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      SELECT id, name, owner_id, owner_type
      FROM Blog WHERE Blog.id=?
    `);
    const blog = sql_query.get(id) as fl.blog.Blog;
    const retv = {blog: blog};
    firelog_db.db?.close();
    return retv;
  }

  static create_blog(user: fl.base.UserIdOpt, blog: fl.blog.Blog){
    const firelog_db = new FireLogDB();
    const new_id = FireLogDB.uuid();
    const sql_query = firelog_db.db!.prepare(`
      INSERT OR IGNORE INTO Blog (id, name, owner_id, owner_type)
      SELECT ? id, ? name, ? owner_id, ? owner_type
    `);
    const owner_id = blog.owner_id || user?.uid || FireLogDB.UUID_NIL;
    const owner_type = blog.owner_type || 'U';
    const sql_res = sql_query.run(new_id, blog.name, owner_id, owner_type);
    const is_inserted = sql_res.changes > 0;
    const retv = {id: is_inserted ? new_id : undefined};
    firelog_db.db?.close();
    return retv;
  }

  static update_blog(user: fl.base.UserIdOpt, blog: fl.blog.Blog){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      UPDATE Blog 
      SET name=?, owner_id=IFNULL(?, owner_id), owner_type=IFNULL(?, owner_type)
      WHERE id=?
    `);
    const owner_id = blog.owner_id;
    const owner_type = blog.owner_type;
    const sql_res = sql_query.run(blog.name, owner_id, owner_type, blog.id!);
    const retv = {changes: sql_res.changes};
    firelog_db.db?.close();
    return retv;
  }

  static delete_blog(user: fl.base.UserIdOpt, id: fl.bytes_t){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      DELETE FROM Blog WHERE id=?
    `);
    const sql_res = sql_query.run(id);
    const retv = sql_res.changes;
    firelog_db.db?.close();
    return retv;
  }


  // [Utility functions]
  static resolve_dir(blog_id: fl.bytes_t){
    const blog_id64 = blog_id.toString('base64url');
    return File.resolve_path(blog_id64);
  }


  // [=== Model initialization ===]
  static init(){
    Logger.log(3, '  Loading Model: Blog');
    const firelog_db = new FireLogDB();
    firelog_db.db?.exec(`
      CREATE TABLE IF NOT EXISTS Blog (
        id BLOB PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        owner_id BLOB,
        owner_type TEXT DEFAULT 'U'
      );
    `);
    firelog_db.db?.close();
  }
}