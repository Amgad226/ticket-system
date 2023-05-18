const asyncWrapper=require('../middlewares/async')
const User = require("../models/user.model");
const AdminMessage =require('../models/adminMessage.model')
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

   return  res.status(200).json(req.conversation );


});


const getConversationMessages = asyncWrapper(async (req, res) => {

    var messages = await AdminMessage.find({conversation:req.params.id});

    return res.json(messages)


});

const storeConversationMessage = asyncWrapper(async (req, res) => {
 
    if(req.user.role=="admin"){
       var {username,_id}=(await nameById(req.conversation.customer))
    }
    else{
       var {username,_id}=( await User.findOne({role:"admin"},{username:1}));
    }
 
    var payload= {
        customer:req.user.id,
        conversation:req.body.conversation_id,
        body:req.body.message,
    }
    var document =await AdminMessage.create(payload);
    req.io.emit(`user-${_id} ${username}`,`admin-message`,document);    

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
    // await AdminConversation.deleteOne({ _id: req.conversation.id });

    return  res.json({message:'delete successfully'})

});

async function nameById(id){
    return await User.findById(id,{username:1})
}

module.exports={
    getConversations,
    getConversation,
    getConversationMessages,
    createConversation,
    deleteConversation,
    storeConversationMessage

}