const asyncWrapper=require('../middlewares/async')
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

const {validator}= require('../validator/validator');
const {ticketIdInParams}= require('../validator/ticket.validation');


const _ = require('lodash');
const ManagerConversation = require('../models/managerConversation.model');


const getTickets= asyncWrapper(async (req, res) => {

const tickets = await Ticket.find()
    return res.json(tickets);
  
});

const getUnassignedTickets= asyncWrapper(async (req, res) => {

    const tickets = await Ticket.find({technician:null})
        return res.json(tickets);
      
    });

const getTicket=asyncWrapper(async(req,res,next)=>{


    await validator(ticketIdInParams)(req,res,next);
  
    const ticket = await Ticket.findById(req.params.id); 
    return res.json(ticket)

      
});

const createTicket =asyncWrapper( async (req, res) => {

    const fieldsToCreate = _.pick(req.body, [
        // 'customer',
        'imagePath',
        'description',
        // 'priority'
    ]);
    fieldsToCreate.customer=req.user.id
    const ticket = new Ticket(fieldsToCreate);

    //  await ManagerConversation.create({ticket:ticket.id,});
     const managerConversation=new ManagerConversation({ticket:ticket.id,participants:[{id:req.user.id ,role:req.user.role}]});
     const newManagerConversation= await managerConversation.save();

    const newTicket = await ticket.save();
    res.status(201).json({message:"ticket  and chat with manager created wait manager assign ticket for start chat and start tech action",newTicket});

});
//updateTicket for a
const updateTicket= asyncWrapper( async (req, res,next) => {

     await validator(ticketIdInParams)(req,res,next);
  

    const ticket = await Ticket.findById(req.params.id); 
  
    const fieldsToUpdate = _.pickBy(req.body, (value) => value !== '');
    const allowedFields = [
    //   'customer',
    //   'imagePath',
    //   'description',
    //   'technician',
      'priority',
    //   'status',
    ];
    const filteredFields = _.pick(fieldsToUpdate, allowedFields);
  
    ticket.set(filteredFields);
  
    const updatedTicket = await ticket.save();

    res.json(updatedTicket);

});

const deleteTicket = asyncWrapper( async (req, res,next) => {

    await validator(ticketIdInParams)(req,res,next);

    const deletedTickets = await Ticket.deleteOne({ _id: req.params.id });

    return res.json({ message: "Ticket deleted" });

});

const giveToTheTechnician =  asyncWrapper( async (req, res,next) => {

    const {technician_id,ticket_id}=req.body

    const technician= await User.findById(technician_id); 
    
    const ticket = await Ticket.findById(ticket_id)
    if(ticket.manager){
        return res.json({    message:`already assigned to technician ${technician.name}`})
    }else {
        ticket.manager=req.user.id,
        ticket.technician= technician_id ,
        ticket.status= "In Progress",
        ticket.priority= req.body.priority
        await ticket.save();

        await ManagerConversation.findOneAndUpdate({ticket:ticket_id} ,
            {
                active:true,
                $push: { participants: {id:req.user.id ,role:req.user.role} }  // Use $push to add the JSON object to the array                
            }
        );      
    }

    return res.json({
        success:1,
        message:`The ticket was given to the technician, ${technician.name} and the conversation is active `
    })
});



module.exports={
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    giveToTheTechnician,
    getUnassignedTickets,
}