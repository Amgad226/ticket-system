const asyncWrapper=require('../middlewares/async')
const User = require("../models/user.model");

const {validator}= require('../validator/validator');
const {createUserValidation,userIdInParams}= require('../validator/user.validation');

const {getAccessToken}= require('./auth.controller')
const _ = require('lodash');
const RevokedToken = require('../models/revokedToken.model');
const Tokens = require('../models/tokens.model');

const getUsers=asyncWrapper(async (req, res) => {
    const users = await User.find();
    res.json(users);
});

const getUser=asyncWrapper(async (req, res,next) => {
  //  return res.json(req.user)
 
    const user = await User.findById(req.params.id); 
    // if(user==null){
    //   return res.status(404).json({ message: "Cannot find user" });
    // }
    res.json(user);
    // , infoByToken:req.user ,token:req.token
});

const addUser=asyncWrapper( async  (req, res,next) => {

    const { errors, statusCode ,fail} = await validator(createUserValidation)(req,res,next);
    if(fail) throw ({errors:errors ,statusCode:statusCode});
   
    const user=new User(req.body);

    const newUser = await user.save();

    return res.status(201).json(newUser);

});

const updateUser= asyncWrapper(async (req, res,next) => {


    const { errors, statusCode ,fail} = await validator(userIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});
  
   
    const user = await User.findById(req.params.id); 
  
    const fieldsToUpdate = _.pickBy(req.body, (value) => value !== '');
    const allowedFields = [
      'username',
      'password',
      'role',
      'name',
      'position',
      'phone',
      'region',
      'street',
      'city',
      'zipCode',
      'noteAddress'
    ];
    const filteredFields = _.pick(fieldsToUpdate, allowedFields);
  
    user.set(filteredFields);
  
    const updatedUser = await user.save();


    // const authHeader = req.header("authorization");
    // const oldAccessToken = authHeader&& authHeader.split(' ')[1]
    // await new RevokedToken({ token: oldAccessToken }).save();

    
  //   var userPayload ={
  //     id:          updatedUser._id,
  //     username:    updatedUser.username,
  //     name:        updatedUser.name,
  //     role:        updatedUser.role,
  // }

  // var newAccessToken= getAccessToken(userPayload)
    res.json({
      success: 1,
      message: "Data updated successfully.",
      data:updatedUser,
      // accessToken:newAccessToken
    });
   
});

const deleteUser=asyncWrapper(async (req, res,next) => {

    const { errors, statusCode ,fail} = await validator(userIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});
  
    await User.findByIdAndDelete(req.params.id);
  
    res.json({
      success: 1,
      message: "Data deleted successfully.",
    });
});

module.exports={
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
}