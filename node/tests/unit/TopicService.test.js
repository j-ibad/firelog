const Logger = require('../utils/Logger');
const FireLogAPI = require('../utils/FireLogAPI');
const TopicService = FireLogAPI.TopicService;


function topicToString(topic){
  if(!topic?.id)  return '<N/A>';
  return `${topic.id.toString('hex')} - "${topic.name}",` +
    `${topic.blog_id?.toString('hex')}`;
}


module.exports = async function test_topic(blog_id){
  // Create Topic 0 & 1
  const topic0_id = await TopicService.createTopic({blog_id, topic: {name: 'Topic 0', blog_id}});
  const topic1_id = await TopicService.createTopic({blog_id, topic: {name: 'Topic 1', blog_id}});
  Logger.log(0, `CreateTopic: ${topic0_id?.toString('hex') || '<N/A>'}`);
  // List
  const topic_list = await TopicService.listTopic({blog_id});
  Logger.log(0, `ListTopic: ${topic_list?.length || 0}`)
  // Get
  for(const topic of topic_list || []){
    const topic_data = await TopicService.getTopic({blog_id, id: topic.id});
    Logger.log(0, `GetTopic: ${topicToString(topic_data)}`);
  }
  // Create
  const topic_id = await TopicService.createTopic({blog_id, topic: {name: `Topic ${topic_list?.length || 0}`, blog_id}});
  Logger.log(0, `CreateTopic: ${topic_id?.toString('hex') || '<N/A>'}`);
  if(topic_id){ // Confirm created data
    const topic_data = await TopicService.getTopic({blog_id, id: topic_id});
    Logger.log(0, `  ${topicToString(topic_data)}`);
  }
  // Update
  const updated_topic_name = `Topic ${topic_list.length} - Updated`
  const res_upd = await TopicService.updateTopic({blog_id, topic: {id: topic_id, name: updated_topic_name, blog_id}});
  Logger.log(0, `UpdateTopic: ${JSON.stringify(res_upd?.status)}`);
  if(topic_id){ // Confirm updated data
    const topic_data = await TopicService.getTopic(blog_id, {id: topic_id});
    Logger.log(0, `  ${topicToString(topic_data)}`);
  }
  // Delete
  const res_del = await TopicService.deleteTopic({blog_id, id: topic_id});
  Logger.log(0, `DeleteTopic: ${JSON.stringify(res_del?.status)}`);
  if(topic_id){ // Confirm deleted data
    const topic_data = await TopicService.getTopic({blog_id, id: topic_id});
    Logger.log(0, `  ${topicToString(topic_data)}`);
  }
  return topic_list?.[0]?.id;
};