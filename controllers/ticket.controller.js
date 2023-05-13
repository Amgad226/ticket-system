const asyncWrapper=require('../middlewares/async')
const Ticket = require("../models/ticket.model");

const {validator}= require('../validator/validator');
const {ticketIdInParams}= require('../validator/ticket.validation');


const {checkRoleForTicket,storeTicketInRes} = require("../utils/utils");

const _ = require('lodash');


const getTickets= asyncWrapper(async (req, res) => {
// console.log('getTickets controller');
const tickets = await Ticket.find()
    return res.json(tickets);
  
});

const getTicket=asyncWrapper(async(req,res,next)=>{


    const { errors, statusCode ,fail} = await validator(ticketIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});
  
    const ticket = await Ticket.findById(req.params.id); 
    return res.json(ticket)

      
})

const createTicket =asyncWrapper( async (req, res) => {


    const fieldsToCreate = _.pick(req.body, [
        // 'customer',
        'imagePath',
        'description',
        'priority'
    ]);
    fieldsToCreate.customer=req.user.id
    const ticket = new Ticket(fieldsToCreate);

    const newTicket = await ticket.save();
    res.status(201).json(newTicket);

});

const updateTicket= asyncWrapper( async (req, res,next) => {

    const { errors, statusCode ,fail} = await validator(ticketIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});
  

    const ticket = await Ticket.findById(req.params.id); 
  
    const fieldsToUpdate = _.pickBy(req.body, (value) => value !== '');
    const allowedFields = [
    //   'customer',
      'imagePath',
      'description',
    //   'technician',
      'priority',
      'status',
    ];
    const filteredFields = _.pick(fieldsToUpdate, allowedFields);
  
    ticket.set(filteredFields);
  
    const updatedTicket = await ticket.save();

    res.json(updatedTicket);

});

const deleteTicket = asyncWrapper( async (req, res) => {

    await checkRoleForTicket(true);

    const deletedTickets = await Ticket.deleteOne({ _id: req.params.id });
    // console.log(`Deleted ticket count: ${deletedTickets.deletedCount}`);

    return res.json({ message: "Ticket deleted" });

  });

  



module.exports={
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket
}