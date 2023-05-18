const {addToErrors}= require('./validator')
const Ticket = require('../models/ticket.model');

async function ticketExistById(id){
    const ticket = await Ticket.findOne({ _id: id});
    return ticket!=null
  }
  function isValidId(id){
    const regex = /^[0-9a-fA-F]{24}$/; // Regular expression for ObjectId format
    return regex.test(id);
  }

  const ticketIdInParams=async(req)=>{
    
    let errors = {}
    let fail = false;
    let code =400;
    
    if ( isValidId( req.params.id) ==false ) {
      addToErrors(errors,'id','not ObjectId formate ')
      fail=true; 
    }

    else if (await   ticketExistById(req.params.id) ==false) {
      addToErrors(errors,'id','ticket not exists ')
      fail=true;
      code=404
    }

    return {
      errors:errors,
      fail:fail,
      statusCode:code
    };
  }

  module.exports={
    ticketIdInParams,
  }