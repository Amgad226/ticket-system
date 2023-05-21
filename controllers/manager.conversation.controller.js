const asyncWrapper=require('../middlewares/async')
const ManagerMessage =require('../models/managerMessage.model')
const ManagerConversation =require('../models/managerConversation.model')
const {validator}= require('../validator/validator');
const {}= require('../validator/user.validation');

const _ = require('lodash');
const Ticket = require('../models/ticket.model');

const getConversations = asyncWrapper(async (req, res) => {
    
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1 if not provided
    const limit = 10; // 
    
    const failedName = (req.user.role=="manager") ?"manager":"customer"
    //if the user logged in manager the query become find({manager:1}) else if user the query become find({customer:1})
    const tickets= await Ticket.find({  [failedName]  :req.user.id},{ _id:1 });

    const ticketIds = tickets.map(ticket => ticket._id);
    
    const totalCount = await ManagerConversation.countDocuments({
        ticket: { $in: ticketIds },
        active: true
      });

    const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages


    const conversations = await ManagerConversation.find({ ticket: { $in: ticketIds } , active:true})
   .populate({  path: 'participants.id', model: 'User',          select: 'username _id'})
   .populate({  path: 'last_message_id', model: 'ManagerMessage',select: 'body -_id'})
   .skip((page - 1) * limit) // Skip documents based on the page number and limit
   .limit(limit) // Limit the number of documents returned per page
   .lean()
   .exec();
  for (let i = 0; i < conversations.length; i++) {
    conversations[i].name=get_name_conversation(conversations[i],req.user.id)
    conversations[i].lastMessage= conversations[i].last_message_id?.body;
    delete conversations[i].__v;
    delete conversations[i].participants;
    delete conversations[i].last_message_id;
    delete conversations[i].active;    
  }
    return res.json({conversations,
       currentPage: page,
       totalPages});
    });

function get_name_conversation(conversation,auth_id){
    let name ; 
    console.log( conversation);
    for (let i = 0; i < conversation.participants.length; i++) {

        console.log(conversation.participants[i]);
        if(conversation.participants[i].id==auth_id)
      {
          continue;
      }
      else{
          name= conversation.participants[i].id.username;
          break;
      }
    }
    // conversation.name =name
    return name ; 
}

const getConversation = async (req, res) => {
    

    var conversation_id= req.conversation.id; 
    


let conversation = await ManagerConversation.findById(conversation_id)
  .populate({  path: 'participants.id', model: 'User',          select: 'username _id'})
  .populate({  path: 'last_message_id', model: 'ManagerMessage',select: 'body -_id'})
  .lean()
  .exec();
  conversation.name=get_name_conversation(conversation,req.user.id)
  
  conversation.lastMessage= conversation.last_message_id.body;
  delete conversation.__v;
  delete conversation.participants;
  delete conversation.last_message_id;
  delete conversation.active;

 return res.json(conversation );
 
};

const getConversationMessages = asyncWrapper(async (req, res) => {

    var messages = await ManagerMessage.find({conversation:req.params.id});
    return res.json(messages)

});

async function get_rest_of_user_id_in_chat(conversation ,auth_id){
    var participants=conversation.participants;
    var otherIds = [];
    /*
     * [
     *    {
     *       id:1,
     *       role:user
     *    },
     *    {
     *       id: 2 
     *       role:manager
     *    }
     * ]
     */

    for(let i = 0 ; i< participants.length ; i++){
        if(participants[i].id != auth_id){
            otherIds.push(participants[i].id)
        }
    }
    return otherIds
}

const storeConversationMessage = asyncWrapper(async (req, res) => {

    var payload= {
        customer:req.user.id,
        conversation:req.body.conversation_id,
        body:req.body.message,
    }
    
    var document =await ManagerMessage.create(payload);
    const documentObj = document.toObject();
    documentObj.sender=req.user.name;
    delete documentObj.__v

    const conversation = await ManagerConversation.findByIdAndUpdate(document.conversation,{last_message_id:document.id});

    const other_user_array =await get_rest_of_user_id_in_chat(conversation ,req.user.id)

   
    for(let i = 0  ; i<other_user_array.length ; i++)
    req.io.emit(`user-${other_user_array[i]}`, 'manager-message',documentObj);    

    return res.status(201).json({
        message:"messages sended",
        document:documentObj
    });
})

const deleteConversation = asyncWrapper(async (req, res) => {
    return res.json({message:"don't know what wa do " });

    var boolean = await ManagerConversation.findByIdAndDelete(req.params.id );
    if(boolean)
    return res.json({message:'deleted successfully ' });
    else
    return res.json({message:'not found'  });

});

module.exports={
    getConversations,
    getConversation,
    getConversationMessages,
    deleteConversation,
    storeConversationMessage,
}