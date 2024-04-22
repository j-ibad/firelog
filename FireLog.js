process.chdir(__dirname);  // Force CWD to be entrypoint's directory
const FireLogAPI = require('./dist/api.js');

const api = new FireLogAPI.FireLogAPI();
api.run();