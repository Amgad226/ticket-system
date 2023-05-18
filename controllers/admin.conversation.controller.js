const asyncWrapper=require('../middlewares/async')
const User = require("../models/user.model");
const Message =require('../models/message.model')
const AdminConversation =require('../models/adminConversation.model')
const {validator}= require('../validator/validator');
const {}= require('../validator/user.validation');
const {findOrCreate }=require('../database/query')
const _ = require('lodash');

const getConversations = asyncWrapper(async (req, res) => {
    const conversations =await AdminConversation.find();
    return res.json(conversations)
});

const getConversation = asyncWrapper(async (req, res) => {

   return  res.status(200).json({conversation :req.conversation ,role:req.user.role} );


});


const getConversationMessages = asyncWrapper(async (req, res) => {

    var messages = await Message.find({conversation:req.params.id});

    return res.json(messages)


});

const storeConversationMessage = asyncWrapper(async (req, res) => {

    var payload= {
        customer:req.user.id,
        conversation:req.body.conversation_id,
        body:req.body.message,
    }
    var document =await Message.create(payload);
    req.io.emit(`user-${req.user.id}-admin`,document);    

    return res.status(201).json({
        message:"messages sended",
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