#!/usr/bin/env node
process.chdir(__dirname);
const fs = require('node:fs');
const path = require('node:path');
const proc = require('child_process');


const BUILD_DIR = path.resolve('build');


function exec_cmd(cmd){
  proc.execSync(cmd, {stdio: 'ignore'});
}


// [Step 1] - Compile Typescript
const TSCONFIG = 'tsconfig.json';
const TSCONFIG_EXE = 'npx tsc';
const TSCONFIG_OPTS = [];
function compile_ts(){
  exec_cmd(`${TSCONFIG_EXE} -p ${TSCONFIG} ${TSCONFIG_OPTS.join(' ')}`);
}

// [Step 2] - Deliver Artifacts
const PROTO_SRC_PATH = path.resolve('..', 'proto');
const PROTO_DST_PATH = path.resolve(BUILD_DIR, 'proto');
function copy_artifacts(){
  fs.cpSync(PROTO_SRC_PATH, PROTO_DST_PATH, {recursive: true});
}



(()=>{  // Anonymous scope main function
  try {
    compile_ts();
    copy_artifacts();
  }catch(err){
    console.log(err.message);
    console.log(err.stack);
  }
})();