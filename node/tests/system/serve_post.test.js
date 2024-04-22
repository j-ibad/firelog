const Logger = require('../utils/Logger');
const FireLogAPI = require('../utils/FireLogAPI');
const FileService = FireLogAPI.FileService;
const express = require('express');


module.exports = async function serve_post(port, blog_id, post_id){
  const app = express();

  app.use('/', async (req, res)=>{
    const path = req.path;
    const files = await FileService.getFiles({blog_id, post_id, paths: [path]}).catch(()=>{return []});
    if(files && files.length > 0){
      const file = files?.[0];
      const file_body = file?.body;
      const file_body_txt = file_body?.toString();
      const file_mime = file?.mime || 'text/plain';
      res.set('Content-Type', file_mime);
      res.send(file_body_txt);
    }else{
      res.send(`File not found: ${path}`);
    }
  });

  return await app.listen(port, ()=>{
    Logger.log(0, `Hosting sample post on port ${port}`);
  });
};