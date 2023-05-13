const {createCostumeError}=require('../errors/customError');


function addToErrors(errors, inputName,errorMessage){
  if (errors[inputName]) {
    errors[inputName].push(` ${errorMessage}`);
  } else {
    errors[inputName] = [` ${errorMessage}`];
  }
}

  const validator = (func) => {
    // try{
    return  async(req,res,next) => {
        
        const {errors,fail,statusCode} =await func(req);
      console.log('i am in validator',fail);
      return {
        errors:errors,
        statusCode:statusCode,
        fail:fail,
    };
      return { errors, statusCode ,fail};
        if ( fail ) {
          console.log('throw from validator');
        //  return  next  (createCostumeError(errors,statusCode))
          // throw Error('error')
          return { errors, statusCode ,fail};
          return ({ errors, statusCode });
        } 
      // next();
        return fail;
      };
      // return 9
    // }
    // catch(err){

    //   console.log(err);
    // }
  };
  module.exports={validator,addToErrors};
