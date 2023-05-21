const asyncWrapper=require('../middlewares/async')
const User = require("../models/user.model");
const AdminMessage =require('../models/adminMessage.model')
const AdminConversation =require('../models/adminConversation.model')
const {validator}= require('../validator/validator');
const {}= require('../validator/user.validation');
const {findOrCreate }=require('../database/query')
const _ = require('lodash');

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
    return res.json(conversations)
});

const getConversation = asyncWrapper(async (req, res) => {

   return  res.status(200).json(req.conversation );


});


const getConversationMessages = asyncWrapper(async (req, res) => {

    var messages = await AdminMessage.find({conversation:req.params.id});

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
 
    var payload= {
        customer:req.user.id,
        conversation:req.body.conversation_id,
        body:req.body.message,
    }
    var document =await AdminMessage.create(payload);
    console.log(document);
    const documentObj = document.toObject();
    documentObj.sender=req.user.name;
    delete documentObj.__v

    req.io.emit(`user-${_id} ${username}`,`admin-message`,documentObj);    

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