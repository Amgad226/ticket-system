const AdminConversation = require("../models/adminConversation.model");

const isAdminOrUserOwner = async (req,res,next)=>{


    if(req.user.role == "admin") {
      return next() 
    }

    else if ( req.conversation.customer.toString() ===req.user.id  ){
      return next() ;
    }
     
    return  res.status(403).json({message:"only user owner chat  or admin "});
  
  }

  //check if the given id by user like mongo id format 
  function isValidId(id){
    const regex = /^[0-9a-fA-F]{24}$/; // Regular expression for ObjectId format
    return regex.test(id);
  }


  /*
     inParams parameter
     if true that mean i will get the conversation_id in params (:id)
     else if false that mean i will get the in body (conversation_id)
  */
const  findAndValidationConversation=(inParams)=>{

  return async function  (req,res,next){
 
    let conversation_id = (inParams)? req.params.id : req.body.conversation_id
    if(conversation_id==null){
      return res.status(400).json({message:"you must enter conversation id "})
    }

    if(! isValidId(conversation_id)){
      return res.status(404).json({message:"you must enter valid conversation id "})
    }
    
    var conversation =await AdminConversation.findById(conversation_id);
    if(conversation==null){
      return res.status(404).json({message:"conversation does not exits"})
    }

    req.conversation=conversation;
    next(); 
  }
}
  
  module.exports={
    isAdminOrUserOwner,
    findAndValidationConversation,
}