const {FireLogAPI: FireLogAPI_connect, IbadGrpcClientCreds} = require('@pub.ibad.one/firelog-node');

const FIRELOG_OPTS = {
  verbose: 3,
};

const FireLogAPI = FireLogAPI_connect('127.0.0.1', 26128, IbadGrpcClientCreds.createInsecure(), FIRELOG_OPTS);
module.exports = FireLogAPI;