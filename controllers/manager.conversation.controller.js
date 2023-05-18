const asyncWrapper=require('../middlewares/async')
const User = require("../models/user.model");
const ManagerMessage =require('../models/managerMessage.model')
const ManagerConversation =require('../models/managerConversation.model')
const {validator}= require('../validator/validator');
const {}= require('../validator/user.validation');

const _ = require('lodash');
const Ticket = require('../models/ticket.model');

const getConversations = asyncWrapper(async (req, res) => {
    
    if(req.user.role== 'manager'){
        const tickets  =await Ticket.find({manager:req.user.id},{ _id:1 });
        const ticketIds = tickets.map(ticket => ticket._id);
        const conversations = await ManagerConversation.find({ ticket: { $in: ticketIds } , active:true});
        return res.json(conversations);
    }
    else if(req.user.role== 'user'){
        const tickets  =await Ticket.find({customer:req.user.id},{ _id:1 });
        const ticketIds = tickets.map(ticket => ticket._id);
        const conversations = await ManagerConversation.find({ ticket: { $in: ticketIds }, active:true });
        return res.json(conversations);
    }
});

const getConversation = async (req, res) => {
    
    // const conversation = await ManagerConversation.findById(req.params.id );
    return res.json(req.conversation);

};

const getConversationMessages = asyncWrapper(async (req, res) => {

    var messages = await ManagerMessage.find({conversation:req.params.id});
    return res.json(messages)

});


const storeConversationMessage = asyncWrapper(async (req, res) => {

    var payload= {
        customer:req.user.id,
        conversation:req.body.conversation_id,
        body:req.body.message,
    }
    var document =await ManagerMessage.create(payload);
    req.io.emit(`user-${req.user.id}`, 'manager-message',document);    

    return res.status(201).json({
        message:"messages sended",
    });
})


const deleteConversation = asyncWrapper(async (req, res) => {
    return res.json({message:"don't know what wa do " });

    var boolean = await ManagerConversation.findByIdAndDelete(req.params.id );
    if(boolean)
    return res.json({message:'deleted successfully ' });
    else
    return res.json({message:'not found'  });

});


module.exports={
    getConversations,
    getConversation,
    getConversationMessages,
    deleteConversation,
    storeConversationMessage

}