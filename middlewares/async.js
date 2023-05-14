const asyncWrapper = (fn) => {
  return async (req, res, next) => {
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
      else{
        status=500;
        message=error.message ;
        key="ErrorMessage";
      }
      return res.status(status).json({ [key] :message})
    }
  }
}

module.exports = asyncWrapper
