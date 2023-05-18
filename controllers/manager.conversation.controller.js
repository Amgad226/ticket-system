const asyncWrapper=require('../middlewares/async')
const User = require("../models/user.model");
const Message =require('../models/message.model')
const ManagerConversation =require('../models/managerConversation.model')
const {validator}= require('../validator/validator');
const {}= require('../validator/user.validation');

const _ = require('lodash');
const Ticket = require('../models/ticket.model');

const getConversations = asyncWrapper(async (req, res) => {

    if(req.user.role== 'manager'){
        const tickets  =await Ticket.find({manager:req.user.id})
        return res.json(tickets)
    }
    else{
        return res.json('user')

    }
    // const conversations = ManagerConversation.find({ticket })
});

const getConversation = asyncWrapper(async (req, res) => {


});

const getConversationMessages = asyncWrapper(async (req, res) => {


});


const deleteConversation = asyncWrapper(async (req, res) => {


});


module.exports={
    getConversations,
    getConversation,
    getConversationMessages,
    deleteConversation

}