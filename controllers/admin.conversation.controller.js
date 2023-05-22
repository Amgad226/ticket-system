const asyncWrapper=require('../middlewares/async')
const User = require("../models/user.model");
const Message =require('../models/message.model')
const AdminConversation =require('../models/adminConversation.model')
const {findOrCreate }=require('../database/query')
const _ = require('lodash');
const Recipient = require('../models/recipient.model');
const ADMIN_ID="111111111111111111111111"
const MAXIMUM_MESSAGES = process.env.MAXIMUM_MESSAGES

const getConversations = asyncWrapper(async (req, res) => {

    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters, default to 1 if not provided
    const limit = 10; // 
  
    const totalCount = await AdminConversation.countDocuments();

    const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages

    const conversations =await AdminConversation.find()   
    .skip((page - 1) * limit) // Skip documents based on the page number and limit
    .limit(limit) // Limit the number of documents returned per page

    return res.json({
        conversations,
        currentPage: page,
        totalPages});
    // return res.json(conversations)
});

const getConversation = asyncWrapper(async (req, res) => {

   return  res.status(200).json(req.conversation );


});


const getConversationMessages = asyncWrapper(async (req, res) => {

    var messages = await Message.find({conversation:req.params.id});
    await Recipient.updateMany(
        { conversation: req.params.id,   customer: req.user.id, read_at:null },
        { $set: { read_at: Date.now() } }
      );

      return res.json(messages)
});



async function nameById(id){
    return await User.findById(id,{username:1})
}

const storeConversationMessage = asyncWrapper(async (req, res) => {
 
    if(req.user.role=="admin"){
       var {username,_id}=(await nameById(req.conversation.customer))
    }
    else{
       var {username,_id}=( await User.findOne({role:"admin"},{username:1}));
    }
    const conversation_id=req.body.conversation_id
    const auth_id= req.user.id;
    var payload= {
        customer:auth_id,
        conversation:conversation_id, 
        body:req.body.message,
    }

    const unReadMessage= await Recipient.find({conversation:conversation_id,   customer:ADMIN_ID ,read_at:null}).countDocuments()
    if(unReadMessage> MAXIMUM_MESSAGES){
        return res.json({message:`you cant send more than ${MAXIMUM_MESSAGES} without admin read`})
    }
    var document =await Message.create(payload);

    Recipient.create({conversation:conversation_id, message:document.id, customer:auth_id ,read_at:Date.now()});
    Recipient.create({conversation:conversation_id, message:document.id, customer: ADMIN_ID });

    const documentObj = document.toObject();
    documentObj.sender=req.user.name;
    delete documentObj.__v

    req.io.emit(`user-${_id}`,`admin-message`,documentObj);    

    return res.status(201).json({
        message:"messages sended",
        document:documentObj
    })
})




const createConversation = asyncWrapper(async (req, res) => {

    const payload = {
        customer:req.user.id,
    }

    const conversation =await findOrCreate( AdminConversation,payload ,payload)
 
    res.status(201).json({
        message:`${conversation.action} conversation with admin successfully`,
        conversation:conversation.document
    });


});

const deleteConversation = asyncWrapper(async (req, res,next) => {
    await AdminConversation.findByIdAndDelete(  req.conversation.id);
    // await AdminConversation.deleteOne({ _id: req.conversation.id });

    return  res.json({message:'delete successfully'})

});



module.exports={
    getConversations,
    getConversation,
    getConversationMessages,
    createConversation,
    deleteConversation,
    storeConversationMessage

}