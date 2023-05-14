const {addToErrors}= require('./validator')
const User = require("../models/user.model");

const createUserValidation = async(req) => {
    const body  =req.body; 
    let errors = {};
    let fail = false;
    let code =400;

    if (!body.username) {
      addToErrors(errors,'username','username is required')
      fail = true;
    }


    const user = await User.findOne({ username: body.username });
    if (user) {
      addToErrors(errors,'username','username must be unique')
      fail = true;    
    } 


    if (typeof body.username !== 'string') {
      addToErrors(errors,'username','username must be a string value')
      fail=true
    }

    if (!body.password) {
      addToErrors(errors,'password','password is required')
      fail=true
    }  

    if (!body.role) {
      addToErrors(errors,'role','role is required')
      fail=true
    }  

    if (!body.name) {
      addToErrors(errors,'name','name is required')
      fail=true
    }

    if (typeof body.name !== 'string') {
      addToErrors(errors,'name','name must be a string value')
      fail=true
    }

    if (!body.position) {
      addToErrors(errors,'name','position is required')
      fail=true
    }

    if (!body.phone) {
      addToErrors(errors,'phone','phone is required')
      fail=true
    }

    if (!body.region) {
      addToErrors(errors,'region','region is required')
      fail=true
    }

    return {
        errors:errors,
        fail:fail,
        statusCode:code
    };
};




 async function userExistById(id){
    const user = await User.findOne({ _id: id});
    return user!=null
  }
  function isValidId(id){
    const regex = /^[0-9a-fA-F]{24}$/; // Regular expression for ObjectId format
    return regex.test(id);
  }

  const userIdInParams=async(req)=>{
    
    let errors = [];
    let fail = false;
    let code =400;
    
    if (await isValidId( req.params.id) ==false ) {
      addToErrors(errors,'id','not ObjectId formate ')
      fail=true; 
    }

    else if (await   userExistById(req.params.id) ==false) {
      addToErrors(errors,'id','user not exists ')
      fail=true;
      code=404
    }

    return {
      errors:errors,
      fail:fail,
      statusCode:code
    };
  }

  module.exports = {createUserValidation,userIdInParams};

  
   
