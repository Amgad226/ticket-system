const ManagerConversation = require("../models/managerConversation.model");
const Ticket= require('../models/ticket.model'); 
const { conversation_id } = require("../validator/conversation.validation");
const { validator } = require("../validator/validator");
const asyncWrapper = require("./async");

const isManagerOrUserOwner = asyncWrapper(async (req,res,next)=>{

  const ticket = await Ticket.findById(req.conversation.ticket)
    if(req.user.role == "manager" ){

        if( req.user.id == ticket.manager) {
            return next() 
        }
    }
    else if(req.user.role == "user" ){

      if( req.user.id == ticket.customer) {
          return next() 
      }
  }
  
    
    return  res.status(403).json({message:"only ticket owner user or ticket responsible manager can access."});
  
  })




  /*
     inParams parameter
     if true that mean i will get the conversation_id in params (:id)
     else if false that mean i will get the in body (conversation_id)
  */
const validationConversation=asyncWrapper(async (req,res,next)=>{

    req.conversation_id = (req.params.id )? req.params.id : req.body.conversation_id
    
    await validator(conversation_id)(req,res,next); 

    next(); 
});

 
  const findConversation=(async(req,res,next)=>{
    // let conversation_id = (req.params.id )? req.params.id : req.body.conversation_id
    let conversation_id = req.conversation_id

    var conversation =await ManagerConversation.findById(conversation_id);
    if(conversation==null){
      return res.status(404).json({message:"conversation does not exits"})
    }
    req.conversation=conversation;
    next(); 
  });

  
  module.exports={
    isManagerOrUserOwner,
    validationConversation,
    findConversation
}