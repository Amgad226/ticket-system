const asyncWrapper=require('../middlewares/async')
const Message =require('../models/message.model')
const ManagerConversation =require('../models/managerConversation.model')
const {validator}= require('../validator/validator');
const {}= require('../validator/user.validation');
const ADMIN_ID="111111111111111111111111"
const MAXIMUM_MESSAGES = process.env.MAXIMUM_MESSAGES
const _ = require('lodash');
const Ticket = require('../models/ticket.model');
const Recipient = require('../models/recipient.model');
const { conversation_id } = require('../validator/conversation.validation');

const getConversations = asyncWrapper(async (req, res) => {
    
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1 if not provided
    const limit = 10; // 
    const auth_role = req.user.role;
    
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
   .populate({  path: 'last_message_id', model: 'Message',select: 'body -_id'})
   .skip((page - 1) * limit) // Skip documents based on the page number and limit
   .limit(limit) // Limit the number of documents returned per page
   .lean()
   .exec();
  for (let i = 0; i < conversations.length; i++) {
    conversations[i].name=get_name_conversation(conversations[i],auth_role)
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

function get_name_conversation(conversation,auth_role){

    /**
     * in conversation.participants i have array 
     * [
     *      {
     *          id:{username:'user name' , role:"user"}    
     *      }
     * 
     *      ,
     *  
     *      {
     *          id:{username:'manager name' , role:"manager"}    
     *      }
     * ]
     * 
     * always user store in first index  conversation.participants[0]
     * and the manager stored in the second index  conversation.participants[1]
     * 
     * for that 
     * when i need to get name of conversation if i am the user i want to get manager name 
     * else if i am the manager i need to get user name 
     */

    return (auth_role=="user") ? conversation.participants[1].id.username :conversation.participants[0].id.username;
}

const getConversation = async (req, res) => {
    

    var conversation_id= req.conversation.id; 
    const auth_role = req.user.role;

let conversation = await ManagerConversation.findById(conversation_id)
  .populate({  path: 'participants.id', model: 'User',          select: 'username _id'})
  .populate({  path: 'last_message_id', model: 'Message',select: 'body -_id'})
  .lean()
  .exec();
  conversation.name=get_name_conversation(conversation,auth_role)
  
  conversation.lastMessage= conversation.last_message_id?.body;
  delete conversation.__v;
  delete conversation.participants;
  delete conversation.last_message_id;
  delete conversation.active;

 return res.json(conversation );
 
};

const getConversationMessages = asyncWrapper(async (req, res) => {

    const conversation_id=req.params.id;
    
    await Recipient.updateMany(
        { conversation: conversation_id,   customer: req.user.id, read_at:null },
        { $set: { read_at: Date.now() } }
      );

    var messages = await Message.find({conversation:conversation_id});
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

    const conversation_id=req.body.conversation_id
    const auth_id= req.user.id;
    var payload= {
        customer:req.user.id,
        conversation:conversation_id,
        body:req.body.message,
    }
    const conversation = await ManagerConversation.findById(conversation_id);

    var manager_id_in_participants=conversation.participants[1].id
    if(req.user.role=="user"){

        const unReadMessage= await Recipient.find({conversation:conversation_id,   customer:manager_id_in_participants ,read_at:null}).countDocuments()
        console.log(unReadMessage ,manager_id_in_participants);

        if(unReadMessage> MAXIMUM_MESSAGES){
            return res.json({message:`you cant send more than ${MAXIMUM_MESSAGES} without admin read`})
        }
    }

    var document =await Message.create(payload);
    const other_user_array =await get_rest_of_user_id_in_chat(conversation ,req.user.id)

    // make this message is read for sender user  
    Recipient.create({conversation:conversation_id, message:document.id, customer:auth_id ,read_at:Date.now()});

    // make this message is unread for receiver user  
                                                                        // user id for the  second user in this conversation 
    Recipient.create({conversation:conversation_id, message:document.id, customer: other_user_array[0] });

    //convert to object for append sender name in response and socket
    const documentObj = document.toObject();
    documentObj.sender=req.user.name;
    delete documentObj.__v


    //update last message id in conversation 
    conversation.last_message_id =document.id;
    await conversation.save();

   // send events for all participants in this conversation (now we have only two user,  but if we decide to make group chat )
    for(let i = 0  ; i<other_user_array.length ; i++)
    req.io.emit(`user-${other_user_array[i]}`, 'manager-message',documentObj);    

    return res.status(201).json({
        message:"messages sended",
        document:documentObj
    });
})

const deleteConversation = asyncWrapper(async (req, res) => {
    // return res.json({message:"don't know what wa do " });

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