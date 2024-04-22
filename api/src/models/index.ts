import Logger from '../utils/Logger';
import {FireLogDB} from '../utils/Persistence';
import BlogModel from '../models/BlogModel';
import TopicModel from '../models/TopicModel';
import PostModel from '../models/PostModel';
import FileModel from '../models/FileModel';


function print_tables(){
  const firelog_db = new FireLogDB();
  const tables = firelog_db.db?.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  const msg = tables?.map((v: any)=>v.name).join(', ') || '<N/A>';
  Logger.log(4, `  Tables: ${msg}`);
  firelog_db.db?.close();
}

export function init_db(){
  Logger.log(2, 'Loading Models');
  print_tables();
  BlogModel.init();
  TopicModel.init();
  PostModel.init();
  FileModel.init();

  print_tables();
  Logger.log(2, '');
}


(()=>{
  init_db();
})();