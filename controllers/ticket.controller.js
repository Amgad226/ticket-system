const asyncWrapper=require('../middlewares/async')
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

const {validator}= require('../validator/validator');
const {ticketIdInParams}= require('../validator/ticket.validation');


const {checkRoleForTicket,storeTicketInRes} = require("../utils/utils");

const _ = require('lodash');


const getTickets= asyncWrapper(async (req, res) => {

const tickets = await Ticket.find()
    return res.json(tickets);
  
});

const getTicket=asyncWrapper(async(req,res,next)=>{


    const { errors, statusCode ,fail} = await validator(ticketIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});
  
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

    const newTicket = await ticket.save();
    res.status(201).json(newTicket);

});
//updateTicket for a
const updateTicket= asyncWrapper( async (req, res,next) => {

    const { errors, statusCode ,fail} = await validator(ticketIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});
  

    const ticket = await Ticket.findById(req.params.id); 
  
    const fieldsToUpdate = _.pickBy(req.body, (value) => value !== '');
    const allowedFields = [
    //   'customer',
    //   'imagePath',
    //   'description',
      'technician',
      'priority',
    //   'status',
    ];
    const filteredFields = _.pick(fieldsToUpdate, allowedFields);
  
    ticket.set(filteredFields);
  
    const updatedTicket = await ticket.save();

    res.json(updatedTicket);

});

const deleteTicket = asyncWrapper( async (req, res) => {
    const { errors, statusCode ,fail} = await validator(ticketIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});

    await checkRoleForTicket(true);

    const deletedTickets = await Ticket.deleteOne({ _id: req.params.id });
    // console.log(`Deleted ticket count: ${deletedTickets.deletedCount}`);

    return res.json({ message: "Ticket deleted" });

});

const giveToTheTechnician =  asyncWrapper( async (req, res,next) => {
    const { errors, statusCode ,fail} = await validator(ticketIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});

    const technician= await User.findById(req.body.technician_id); 
    // const ticket = await Ticket.findById(req.params.id); 
    const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id,
        {
             technician: req.body.technician_id ,
             status: "In Progress",
             priority: req.body.priority

        },
        // { new: true }
      );

    return res.json({
        success:1,
        message:`The ticket was given to the technician, ${technician.name}`
    })
});



module.exports={
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    giveToTheTechnician
}