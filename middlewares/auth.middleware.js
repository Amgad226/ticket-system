const jwt= require("jsonwebtoken");
const RevokedToken = require("../models/revokedToken.model");
const User = require("../models/user.model");


function getTokenFromHeader(authorization){
  const authHeader = authorization;
  const accessToken = authHeader&& authHeader.split(' ')[1]
  return accessToken
}
async function check(token){

const accessToken= getTokenFromHeader(token)

  try {
      
    // check if the access token is revoked
    const isAccessTokenRevoked = await RevokedToken.findOne({ token: accessToken });

    if (isAccessTokenRevoked ) {
      return {
        success:false ,
        message:'Unauthorized Revoked Token',
        status:401
      }

    }
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    
    var {_id,role,name,username} = await User.findById(decoded.userPayload.id)
    const user =  {id:_id.toString(),role,name,username};
    return {
      success:true ,
      message:'valid accessToken',
      status:200,
      decoded:user
    }

  } catch (err) {
    return {
      success:false ,
      message:'Invalid Access Token , accessToken was expired',
      msg:err.message,
      status:401
    }
  }
}



// Middleware to verify JWT token
async function verifyToken(req, res, next) {
    // get token 
                                        // req.header('token')
    const accessToken=getTokenFromHeader( req.header("authorization"));
    if (!accessToken) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    // Verify token
    const result  = await check(accessToken);
    if(result.success==false ){
      return res.status(result.status).json({ message:result.message });
    }else{
      req.user=result.decoded
      next()
    }
  }

  

  
module.exports = {
  verifyToken,check
};
