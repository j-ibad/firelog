const Logger = require('../utils/Logger');
const FireLogAPI = require('../utils/FireLogAPI');
const PostService = FireLogAPI.PostService;


function postToString(post){
  if(!post?.id)  return '<N/A>';
  return `${post.id.toString('hex')} - "${post.name}",` +
    `${post.topic_id?.toString('hex')}`;
}


module.exports = async function test_post(blog_id, topic_id){
  // Create Post 0 & 1
  const post0_id = await PostService.createPost({blog_id, post: {name: 'Post 0', topic_id}});
  const post1_id = await PostService.createPost({blog_id, post: {name: 'Post 1', topic_id}});
  Logger.log(0, `CreatePost: ${post0_id?.toString('hex') || '<N/A>'}`);
  // List
  const post_list = await PostService.listPost({blog_id, topic_id});
  Logger.log(0, `ListPost: ${post_list?.length || 0}`)
  // Get
  for(const post of post_list || []){
    const post_data = await PostService.getPost({blog_id, id: post.id});
    Logger.log(0, `GetPost: ${postToString(post_data)}`);
  }
  // Create
  const post_id = await PostService.createPost({blog_id, post: {name: `Post ${post_list?.length || 0}`, topic_id}});
  Logger.log(0, `CreatePost: ${post_id?.toString('hex') || '<N/A>'}`);
  if(post_id){ // Confirm created data
    const post_data = await PostService.getPost({blog_id, id: post_id});
    Logger.log(0, `  ${postToString(post_data)}`);
  }
  // Update
  const updated_post_name = `Post ${post_list.length} - Updated`
  const res_upd = await PostService.updatePost({blog_id, post: {id: post_id, name: updated_post_name, topic_id}});
  Logger.log(0, `UpdatePost: ${JSON.stringify(res_upd?.status)}`);
  if(post_id){ // Confirm updated data
    const post_data = await PostService.getPost({blog_id, id: post_id});
    Logger.log(0, `  ${postToString(post_data)}`);
  }
  // Delete
  const res_del = await PostService.deletePost({blog_id, id: post_id});
  Logger.log(0, `DeletePost: ${JSON.stringify(res_del?.status)}`);
  if(post_id){ // Confirm deleted data
    const post_data = await PostService.getPost({blog_id, id: post_id});
    Logger.log(0, `  ${postToString(post_data)}`);
  }
  return post_list?.[0]?.id;
};