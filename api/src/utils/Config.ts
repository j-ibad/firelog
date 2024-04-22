import fs from 'fs';
import path from 'path';
import toml from 'toml';

// Read config file and export app configuration
const APP_CONF_PATH = path.join('config', 'firelog.server.conf');
const APP_CONF_F = fs.readFileSync(APP_CONF_PATH, 'utf-8');
export const APP_CONF = toml.parse(APP_CONF_F);



// Path / File project-wide constants
export function try_mkdir(dir_path: string){
  if(!fs.existsSync(dir_path)){  // Create folder structure if does not exist
    fs.mkdirSync(dir_path, {recursive: true});
  }
}

function resolve_dir(dst_path: string[], def_path: string[]=[]){
  const resolved_path = path.resolve(...(dst_path || def_path));
  try_mkdir(resolved_path);
  return resolved_path;
}

export const FIRELOG_DATA_DIR = resolve_dir(APP_CONF?.data?.dir, ['data']);