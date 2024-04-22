#!/usr/bin/env node
import {IbadGrpcServerCreds} from '@pub.ibad.one/ibad-grpc';

import './models';
import {gRPC} from './services';
import {APP_CONF} from './utils/Config';
import Logger from './utils/Logger';

const host = APP_CONF?.server?.host || '0.0.0.0';
const port = APP_CONF?.server?.port || 26128;


export class FireLogAPI{
  run(){
    //  Catch-all for uncaught Node errors
    process.on('uncaughtException', err => {
      Logger.log(-1, '[UNCAUGHT ERROR]');
      Logger.log(-1, err.name);
      Logger.log(-1, err.message);
      Logger.log(-1, err.stack!);
    });
    
    // [=== Start Event Loop ===]
    gRPC.bind(host, port, IbadGrpcServerCreds.createInsecure(),
      (err: Error|null, port: string|number) =>{
        if(err) Logger.log(-1, [err.name, err.message].join('\n'));
        else Logger.log(0, `FireLog API running on port ${host}:${port}`);
      }
    )
  }
} 


// Main function creates instance of API and runs
function main(){
  const api = new FireLogAPI();
  api.run();
}
// Run main function if invoked directly as entrypoint
if(require.main === module){
  main();
}