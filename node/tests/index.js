const Logger = require('./utils/Logger');

const test_blog = require('./unit/BlogService.test');
const test_topic = require('./unit/TopicService.test');
const test_post = require('./unit/PostService.test');
const test_files = require('./unit/FileService.test');

const serve_post = require('./system/serve_post.test');
const serve_blog = require('./system/serve_blog.test');
const serve_blog_nested = require('./system/serve_blog_nested.test');




async function test_0(){
  const blog0_id = await test_blog();
  const topic0_id = blog0_id && await test_topic(blog0_id);
  const post0_id = topic0_id && await test_post(blog0_id, topic0_id);
  Logger.log(0, blog0_id.toString('base64url'));
  Logger.log(0, post0_id.toString('base64url'));
  post0_id && await test_files(blog0_id, post0_id);
}

async function test_1(blog0_id, post0_id){
  post0_id && await test_files(blog0_id, post0_id);
}



async function test(){
  const blog0_id = Buffer.from('UBiQN471Sb2Iav5lpiU9iw', 'base64url');
  const post0_id = Buffer.from('jKZCUBh-S0-qfJOsrDGQ2A', 'base64url');
  // test_0();
  // test_1(blog0_id, post0_id);
  // await serve_post(8080, blog0_id, post0_id);
  // await serve_blog(8080, blog0_id);
  await serve_blog_nested(8080, blog0_id);
}

test();