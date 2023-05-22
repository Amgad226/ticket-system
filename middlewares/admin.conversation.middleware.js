const AdminConversation = require("../models/adminConversation.model");
const { conversation_id,message_body } = require("../validator/conversation.validation");
const { validator } = require("../validator/validator");
const asyncWrapper = require("./async");

const isAdminOrUserOwner = async (req,res,next)=>{


    if(req.user.role == "admin") {
      return next() 
    }

    else if ( req.conversation.customer.toString() ===req.user.id  ){
      return next() ;
    }
     
    return  res.status(403).json({message:"only user owner chat  or admin "});
  
  }

  const findConversation=async(req,res,next)=>{
    var conversation =await AdminConversation.findById(req.conversation_id);
    if(conversation==null){
      return res.status(404).json({message:"conversation does not exits"})
    }

    req.conversation=conversation;
    next(); 
  }





const validationConversation=asyncWrapper(async (req,res,next)=>{

  req.conversation_id = (req.params.id )? req.params.id : req.body.conversation_id
  
  await validator(conversation_id)(req,res,next); 
  // await validator(message_body)(req,res,next); 

  next(); 
});
  
  module.exports={
    isAdminOrUserOwner,
    validationConversation,
    findConversation,
}