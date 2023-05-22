

function addToErrors(errors, inputName,errorMessage){

    errors[inputName] = errorMessage;
  
}


// function addToErrorsArray(errors, inputName,errorMessage){
//   if (errors[inputName]) {
//     errors[inputName].push(` ${errorMessage}`);
//   } else {
//     errors[inputName] = ` ${errorMessage}`;
//   }
// }

  const validator =( (func) => {
    return  async(req,res,next) => {
      
        const {errors,fail,statusCode} =await func(req);
        if(fail) throw ({errors:errors ,statusCode:statusCode});
        // return true;
    
    }
  });
  module.exports={validator,addToErrors};
