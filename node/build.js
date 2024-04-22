#!/usr/bin/env node
process.chdir(__dirname);
const proc = require('child_process');


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



(()=>{  // Anonymous scope main function
  try {
    compile_ts();
  }catch(err){
    console.log(err.message);
    console.log(err.stack);
  }
})();