const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      let status= ( error.statusCode) ? error.statusCode :500;
      let message=( error.errors)    ? error.errors    :  error.message;
    
      return res.status(status).json({message:message})
    }
  }
}

module.exports = asyncWrapper
