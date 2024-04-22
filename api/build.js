#!/usr/bin/env node
process.chdir(__dirname);
const fs = require('fs');
const path = require('path');
const proc = require('child_process');

const BUILD_DIR = path.join('build', 'api');
const DIST_DIR = path.join('..', 'dist');

const package_json = require('./package.json');


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


// [Step 2] - Minify & Bundle
const ESBUILD_EXE = path.join('node_modules', '.bin', 'esbuild');
const ESBUILD_OPTS = ['--minify --bundle --allow-overwrite --format=cjs --platform=node'];
//  Mark external packages for bundle exclusion
function bundle(){
  const exclude_deps = Object.keys(package_json?.dependencies || {});
  if(exclude_deps.length > 0){
    ESBUILD_OPTS.push(['', ...exclude_deps].join(' --external:'));
  }
  exec_cmd(`${ESBUILD_EXE} ./${BUILD_DIR} ${ESBUILD_OPTS.join(' ')} --outdir=${DIST_DIR}`);
}


// [Step 3] - Append Artifacts
const ARTIFACTS_SRC = [['LICENSE']];
function cp_artifacts(){
  const package_dist_json = Object.assign({}, package_json, require('./package.dist.json'));
  const package_dist_json_str =  JSON.stringify(package_dist_json, null, 2)
  fs.writeFileSync(path.resolve(DIST_DIR, 'package.json'), package_dist_json_str);


  const artifacts_dst = path.resolve(DIST_DIR);
  for(const artifact_src of ARTIFACTS_SRC){
    const src_path = path.resolve(...artifact_src);
    const dst_path = path.resolve(artifacts_dst, ...artifact_src);
    fs.cpSync(src_path, dst_path);
  }
}



(()=>{  // Anonymous scope main function
  try {
    compile_ts();
    bundle();
    cp_artifacts();
  }catch(err){
    console.log(err.message);
    console.log(err.stack);
  }
})();