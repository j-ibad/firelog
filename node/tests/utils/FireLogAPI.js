const path = require('path');
const {IbadGrpClientCreds} = require('@pub.ibad.one/ibad-grpc');
const FireLogAPI_connect = require('@pub.ibad.one/firelog-node').FireLogAPI;

const PROTO_PATH = path.join(__dirname, '..', '..', '..', 'proto', 'firelog.proto');
const FIRELOG_OPTS = {
  verbose: 3,
  grpc: {proto: {path: PROTO_PATH}}
};



const FireLogAPI = FireLogAPI_connect('127.0.0.1', 26128, IbadGrpClientCreds.createInsecure(), FIRELOG_OPTS);
module.exports = FireLogAPI;