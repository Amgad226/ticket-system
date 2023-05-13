
const errorHandlerMiddleware=(err,req,res,next)=>{
    console.log(err.message);
  console.log('log from error handler Middleware ');

  let status= ( err.statusCode) ? err.statusCode :500;
  let message=( err.message)    ? err.message    :'unknown error catch by error handler middleware';

  return res.status(status).json({message:message  , status: status });
}
module.exports={errorHandlerMiddleware}
