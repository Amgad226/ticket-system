
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const RevokedToken = require('../models/revokedToken.model');
const Tokens = require("../models/tokens.model");


const login =async (req, res) => {

    const { username, password } = req.body;
    const user = await User.findOne(({username:username}));

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
 
    var userPayload ={
        id:          user._id,
        // username:    user.username,
        // name:        user.name,
        // role:        user.role,
        // isActive:    user.isActive,
        // phone:       user.phone,
        // position:    user.position,
        // region:      user.region,
        // street:      user.street,
        // city:        user.city,
        // zipCode:     user.zipCode,
        // noteAddress: user.noteAddress,
    }
 
    const accessToken  =getAccessToken(userPayload);
    const refreshToken =getRefreshToken(userPayload);
    // await Tokens.create({
    //     access:accessToken,
    //     refresh:refreshToken,
    //     user_id:user._id,
    //   })
   return res.send({
       user:user,
       accessToken:accessToken,
       refreshToken:refreshToken,
   });
}

const token=async (req, res) => {

    const { username, password } = req.body;
    const user = await User.findOne(({username:username}));

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
 
    var userPayload ={
        id:          user._id,
        // username:    user.username,
        // name:        user.name,
        // role:        user.role,
        // isActive:    user.isActive,
        // phone:       user.phone,
        // position:    user.position,
        // region:      user.region,
        // street:      user.street,
        // city:        user.city,
        // zipCode:     user.zipCode,
        // noteAddress: user.noteAddress,
    }
 
    const accessToken  =getAccessToken(userPayload);
    // const refreshToken =getRefreshToken(userPayload);

   return res.send(accessToken,);
}

const logout= async(req, res) => {
    const authHeader = req.header("authorization");
    const accessToken = authHeader&& authHeader.split(' ')[1]

    // revoke the access token
    await new RevokedToken({ token: accessToken }).save();


    
    res.json({ message: "Logged out" });
}

const  getAccessTokenFromRefresh=(req,res,next)=>{

    const refreshToken = req.body.refreshToken;

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid refresh token' });
        }
        // Generate a new access token and a new refresh token
        const accessToken =getAccessToken(user.userPayload) ;
        const refreshToken =getRefreshToken(user.userPayload);
    
        // Return the new access token and new refresh token
        return res.status(200).json({ 
            accessToken: accessToken ,
            refreshToken: refreshToken 
        });
      });

}

function getAccessToken(userPayload){

    var secretAccessKey=process.env.JWT_ACCESS_TOKEN_SECRET
    // var expiresAccessIn=process.env.ACCESS_TOKEN_EXPIRES_IN
    var expiresAccessIn=60*30
    console.log(expiresAccessIn);

    return jwt.sign({userPayload}, secretAccessKey, { expiresIn:expiresAccessIn });

}

function getRefreshToken(userPayload){
    var secretRefreshKey=process.env.JWT_REFRESH_TOKEN_SECRET
    // var expiresRefreshIn=process.env.REFRESH_TOKEN_EXPIRES_IN
    var expiresRefreshIn=6000
    return  jwt.sign({userPayload}, secretRefreshKey, { expiresIn:expiresRefreshIn });
}

module.exports={
    login,
    token,
    logout,
    getAccessTokenFromRefresh,
    getAccessToken,
}