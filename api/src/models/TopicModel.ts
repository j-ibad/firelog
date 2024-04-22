import Logger from '../utils/Logger';
import {FireLogDB} from '../utils/Persistence';
import File from '../utils/File';
import type {firelog as fl} from '../@types/firelog';


export default class TopicModel {
  // [=== Model CRUD Operations ===]
  static list_topic(user: fl.base.UserIdOpt, page: fl.base.PageOpt, blog_id: fl.bytes_t){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      SELECT id, name, blog_id 
      FROM Topic WHERE blog_id=?
    `);
    const topic = sql_query.all(blog_id) as fl.topic.Topic[];
    const retv = {topic: topic};
    firelog_db.db?.close();
    return retv;
  }

  static get_topic(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, id: fl.bytes_t){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      SELECT id, name, blog_id
      FROM Topic 
      WHERE Topic.blog_id=? AND Topic.id=?
    `);
    const topic = sql_query.get(blog_id, id) as fl.topic.Topic;
    const retv = {topic: topic};
    firelog_db.db?.close();
    return retv;
  }

  static create_topic(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, topic: fl.topic.Topic){
    const firelog_db = new FireLogDB();
    const new_id = FireLogDB.uuid();
    const sql_query = firelog_db.db!.prepare(`
      INSERT OR IGNORE INTO Topic (id, name, blog_id)
      SELECT ? id, ? name, ? blog_id
    `);
    const sql_res = sql_query.run(new_id, topic.name, blog_id);
    const is_inserted = sql_res.changes > 0;
    const retv = {
      id: is_inserted ? new_id : undefined,
      blog_id: is_inserted ? blog_id : undefined
    };
    firelog_db.db?.close();
    return retv;
  }

  static update_topic(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, topic: fl.topic.Topic){
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      UPDATE Topic 
      SET name=?, blog_id=IFNULL(?, blog_id)
      WHERE blog_id=? AND id=?
    `);
    const blog_id_upd = topic.blog_id;
    const sql_res = sql_query.run(topic.name, blog_id_upd, blog_id, topic.id!);
    const retv = {changes: sql_res.changes};
    firelog_db.db?.close();
    return retv;
  }

  static delete_topic(user: fl.base.UserIdOpt, blog_id: fl.bytes_t, id: fl.bytes_t){
    // Prefetch existing topic data
    const {topic: topic_data} = TopicModel.get_topic(user, blog_id, id);
    // Proceed with Topic deletion
    const firelog_db = new FireLogDB();
    const sql_query = firelog_db.db!.prepare(`
      DELETE FROM Topic WHERE blog_id=? AND id=?
    `);
    const sql_res = sql_query.run(blog_id, id);
    const retv = {
      changes: sql_res.changes,
      topic: topic_data
    };
    firelog_db.db?.close();
    return retv;
  }


  // [Utility functions]
  static resolve_dir(blog_id: fl.bytes_t, topic_id: fl.bytes_t){
    const blog_id64 = blog_id.toString('base64url');
    const topic_id64 = topic_id.toString('base64url');
    return File.resolve_path(blog_id64, topic_id64);
  }


  // [=== Model initialization ===]
  static init(){
    Logger.log(3, '  Loading Model: Topic');
    const firelog_db = new FireLogDB();
    firelog_db.db?.exec(`
      CREATE TABLE IF NOT EXISTS Topic (
        id BLOB PRIMARY KEY,
        name TEXT NOT NULL,
        blog_id BLOB NOT NULL REFERENCES Blog(id),
        UNIQUE (blog_id, name)
      );
    `);
    firelog_db.db?.close();
  }
}