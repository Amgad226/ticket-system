const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      // return res.status(400).json( err.message)

      let key;
      let status;
      let message;
      // let status (  err.statusCode) ? err.statusCode :500;
      // let message=( err.errors)    ? err.errors    :  err.message;
      if(( err.errors)){
        status=err.statusCode;
        message=err.errors ;
        key="validationMessage";
      }
      if(err.statusCode==null || err.errors==null){
        status=500;
        message=err.message ;
        key="ErrorMessage";
      }
      // return res.status(status).json(message[0])
      return res.status(status).json({ [key] :message})
    }
  }
}

module.exports = asyncWrapper
