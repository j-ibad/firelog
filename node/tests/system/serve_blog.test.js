const Logger = require('../utils/Logger');
const FireLogAPI = require('../utils/FireLogAPI');
const PostService = FireLogAPI.PostService;
const FileService = FireLogAPI.FileService;
const express = require('express');


module.exports = async function serve_blog(port, blog_id){
  const app = express();

  app.use('/', async (req, res)=>{
    const path_nodes = req.path.replace(/^[/]/g, '').split('/');
    // Preprocess path
    const post_uri = path_nodes.shift().trim();
    const file_path = path_nodes.join('/').trim() || 'index.html';
    // Resolve post path
    const post_id = post_uri && await PostService.nameToPostUri({blog_id, uri: post_uri});
    // Retrieve files
    const files = post_id && await FileService.getFiles({blog_id, post_id, paths: [file_path]}).catch(()=>{return []});
    if(files && files.length > 0){
      const file = files?.[0];
      const file_body = file?.body;
      const file_body_txt = file_body?.toString();
      const file_mime = file?.mime || 'text/plain';
      res.set('Content-Type', file_mime);
      res.send(file_body_txt);
    }else{
      res.send(`File not found: ${file_path}`);
    }
  });

  return await app.listen(port, ()=>{
    Logger.log(0, `Hosting sample blog on port ${port}`);
  });
};