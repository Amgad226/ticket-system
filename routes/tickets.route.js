const express = require("express");
const router = express.Router();
const {getTickets ,getTicket , createTicket ,updateTicket ,deleteTicket ,giveToTheTechnician,getUnassignedTickets,closeTicket}=require('../controllers/ticket.controller');
const { verifyToken} = require("../middlewares/auth.middleware");
const {handleSendByFormData}=require('../middlewares/form-data.middleware')
const {isAdminOrManager, isUserAndNotTicketOwner ,isUser,isManager,managerResponsibleOnTicket}=require('../middlewares/roles.middlewre');
const { ticketValidation } = require("../middlewares/ticket.middleware");


// GET all tickets //only admin or manager can access to this route
router.get("/", [verifyToken, isAdminOrManager], getTickets);

// GET all tickets //only admin or manager can access to this route
router.get("/unassigned", [verifyToken, isAdminOrManager], getUnassignedTickets);

// GET a single ticket by ID  //if user and not your ticket access deny else if you admin or tech or manager you can access
router.get("/:id", [verifyToken, isUserAndNotTicketOwner], getTicket   );

// CREATE a new ticket // any one can create a new ticket 
router.post("/", [handleSendByFormData,verifyToken, isUser], createTicket);

// handle if send PATCH request on users without id in url
router.patch('/', (req, res) => {  return res.status(400).json({ message: 'You must provide an ID in the URL.' });});

// UPDATE a ticket by ID  //if user and not your ticket access deny else if you admin or tech or manager you can access
router.patch("/:id",[handleSendByFormData,  verifyToken,isManager], updateTicket);

// DELETE a ticket by ID // any one can delete the ticket 
router.delete("/:id",[ verifyToken ,isManager],  deleteTicket);

// Give ticket To The Technician
router.post("/giveToTheTechnician", [handleSendByFormData,verifyToken,isManager], [giveToTheTechnician]);

// change ticket status to close and delete ticket conversation and his messages 
router.get('/close/:id',[ verifyToken ,ticketValidation,managerResponsibleOnTicket], closeTicket)

module.exports = router;
