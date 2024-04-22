const Logger = require('../utils/Logger');
const FireLogAPI = require('../utils/FireLogAPI');
const BlogService = FireLogAPI.BlogService;


function blogToString(blog){
  if(!blog?.id)  return '<N/A>';
  return `${blog.id.toString('hex')} - "${blog.name}",` +
    `${blog.owner_id?.toString('hex')}, ${blog.owner_type}`;
}


module.exports = async function test_blog(){
  // Create Blog 0 & 1
  const blog0_id = await BlogService.createBlog({blog: {name: 'Blog 0'}});
  const blog1_id = await BlogService.createBlog({blog: {name: 'Blog 1'}});
  Logger.log(0, `CreateBlog: ${blog0_id?.toString('hex') || '<N/A>'}`);
  // List
  const blog_list = await BlogService.listBlog({});
  Logger.log(0, `ListBlog: ${blog_list?.length || 0}`)
  // Get
  for(const blog of blog_list || []){
    const blog_data = await BlogService.getBlog({id: blog.id});
    Logger.log(0, `GetBlog: ${blogToString(blog_data)}`);
  }
  // Create
  const blog_id = await BlogService.createBlog({blog: {name: `Blog ${blog_list.length}`}});
  Logger.log(0, `CreateBlog: ${blog_id?.toString('hex') || '<N/A>'}`);
  if(blog_id){ // Confirm created data
    const blog_data = await BlogService.getBlog({id: blog_id});
    Logger.log(0, `  ${blogToString(blog_data)}`);
  }
  // Update
  const updated_blog_name = `Blog ${blog_list.length} - Updated`
  const res_upd = await BlogService.updateBlog({blog: {id: blog_id, name: updated_blog_name}});
  Logger.log(0, `UpdateBlog: ${JSON.stringify(res_upd?.status)}`);
  if(blog_id){ // Confirm updated data
    const blog_data = await BlogService.getBlog({id: blog_id});
    Logger.log(0, `  ${blogToString(blog_data)}`);
  }
  // Delete
  const res_del = await BlogService.deleteBlog({id: blog_id});
  Logger.log(0, `DeleteBlog: ${JSON.stringify(res_del?.status)}`);
  if(blog_id){ // Confirm deleted data
    const blog_data = await BlogService.getBlog({id: blog_id});
    Logger.log(0, `  ${blogToString(blog_data)}`);
  }
  return blog_list?.[0]?.id;
};