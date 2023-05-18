const jwt= require("jsonwebtoken");
const RevokedToken = require("../models/revokedToken.model");
const User = require("../models/user.model");




// Middleware to verify JWT token
async function verifyToken(req, res, next) {
    // const token = req.header('token')
    const authHeader = req.header("authorization");
    const accessToken = authHeader&& authHeader.split(' ')[1]
    if (!accessToken) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
  
    // Verify token
    try {
      
      // check if the access token is revoked
      const isAccessTokenRevoked = await RevokedToken.findOne({ token: accessToken });

  
      // check if the refresh token is revoked
      // const isRefreshTokenRevoked = await RevokedToken.findOne({ token: refreshToken });
  
      if (isAccessTokenRevoked ) {
        // deny access to the user
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
      req.token = decoded.userPayload;
      
      var {_id,role,name,username} = await User.findById(decoded.userPayload.id)
      // var user = await User.findById(decoded.userPayload.id)
      req.user = {id:_id.toString(),role,name,username};


      next();
    } catch (err) {
     return  res.status(401).json({ message: "Invalid Access Token , token was expired",err:err.message });
    }
  }
  

  
module.exports = {
  verifyToken,
};
