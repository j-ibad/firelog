const Logger = require('../utils/Logger');
const FireLogAPI = require('../utils/FireLogAPI');
const FileService = FireLogAPI.FileService;


const POST0_FILES = {
  'index.html': {
    path: 'index.html',
    body: Buffer.from(`
      <link rel="stylesheet" href="styles.css">
      <div> Post 0 - Index </div>
    `)
  },
  'styles.css': {
    path: 'styles.css',
    body: Buffer.from(`body { background: #0d1b2a; color: #dddddd; }`)
  }
}

module.exports = async function test_files0(blog_id, post_id){
  // Prefill post with files
  const files0_pre = await FileService.updateFiles({
    blog_id, post_id,
    file_ops: [
      {op: 'w', file: POST0_FILES['index.html']},
      {op: 'w', file: POST0_FILES['styles.css']},
    ]
  });
  // List
  const paths0 = await FileService.listFiles({blog_id, post_id});
  Logger.log(0, paths0);
  // Get
  const files0 = await FileService.getFiles({blog_id, post_id, paths: paths0});
  Logger.log(0, files0);
};