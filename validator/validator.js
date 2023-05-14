const {createCostumeError}=require('../errors/customError');


function addToErrors(errors, inputName,errorMessage){

    errors[inputName] = ` ${errorMessage}`;
  
}


function addToErrorsArray(errors, inputName,errorMessage){
  if (errors[inputName]) {
    errors[inputName].push(` ${errorMessage}`);
  } else {
    errors[inputName] = ` ${errorMessage}`;
  }
}

  const validator = (func) => {
    // try{
    return  async(req,res,next) => {
        
        const {errors,fail,statusCode} =await func(req);
      // console.log('i am in validator',fail);
      return {
        errors:errors,
        statusCode:statusCode,
        fail:fail,
    };
     
      };
    
  };
  module.exports={validator,addToErrors};
