const asyncWrapper=require('../middlewares/async')
const User = require("../models/user.model");
const Message =require('../models/message.model')
const AdminConversation =require('../models/adminConversation.model')
const {validator}= require('../validator/validator');
const {}= require('../validator/user.validation');

const _ = require('lodash');

const getConversations = asyncWrapper(async (req, res) => {


});

const getConversation = asyncWrapper(async (req, res) => {


});


const getConversationMessages = asyncWrapper(async (req, res) => {


});


const createConversation = asyncWrapper(async (req, res) => {


});

const deleteConversation = asyncWrapper(async (req, res) => {


});


module.exports={
    getConversations,
    getConversation,
    getConversationMessages,
    createConversation,
    deleteConversation

}