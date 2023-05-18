const {addToErrors}= require('./validator')

const conversation_id= (req,res,next)=>{
    let errors = {};
    let fail = false;
    let code =400;

    // let conversation_id = (req.params.id )? req.params.id : req.body.conversation_id
    let conversation_id = req.conversation_id

    if (conversation_id==null) {
        addToErrors(errors,'conversation_id','conversation_id is required')
        fail = true;
      }
  
      if (! isValidId(conversation_id)) {
        addToErrors(errors,'conversation_id','you must enter valid conversation id')
        code =404;
        fail = true;
      }
      
    return {
        errors:errors,
        fail:fail,
        statusCode:code
    };
}
function isValidId(id){
    const regex = /^[0-9a-fA-F]{24}$/; // Regular expression for ObjectId format
    return regex.test(id);
  }
module.exports={conversation_id}