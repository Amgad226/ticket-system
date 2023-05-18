const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    if (!req.file) {
      // Handle the empty field case here
      // For example, you can send an error response or perform a different action
      return res.status(400).json({ error: 'Field is empty' });
    }
    try {
      await fn(req, res, next)
    } catch (error) {

      let key;
      let status;
      let message;
      // let status ( error.statusCode) ? error.statusCode :500;
      // let message=( error.errors)    ? error.errors    :  error.message;
      if(( error.errors)){
        status=error.statusCode;
        message=error.errors ;
        key="validationMessage";
      }
      if(error.statusCode==null || error.errors==null){
        status=500;
        message=error.message ;
        key="ErrorMessage";
      }
      return res.status(status).json({ [key] :message})
    }
  }
}

module.exports = asyncWrapper
