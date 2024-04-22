import path from 'path';
import sqlite3 from 'better-sqlite3';
import {v4 as uuidv4} from 'uuid';

import {FIRELOG_DATA_DIR, try_mkdir} from '../utils/Config';

const DB_DIR = path.join(FIRELOG_DATA_DIR, 'db');
try_mkdir(DB_DIR);
const FIRELOG_DB_FILE = path.join(DB_DIR, 'firelog.db');


export class FireLogDB {
  db?: sqlite3.Database;

  constructor(){
    this.db = sqlite3(FIRELOG_DB_FILE);
  }

  static uuid(){ 
    return uuidv4({}, Buffer.from(new Uint8Array(16)));
  }

  static UUID_NIL = Buffer.from(new Uint8Array(16));
}