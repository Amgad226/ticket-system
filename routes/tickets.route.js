const express = require("express");
const router = express.Router();
const {getTickets ,getTicket , createTicket ,updateTicket ,deleteTicket}=require('../controllers/ticket.controller');
const {   verifyToken,  checkRoleForTicket} = require("../utils/utils");
const {upload} =require('../multer')

// GET all tickets
router.get("/", [verifyToken, checkRoleForTicket(true)], 
getTickets
// (req,res)=>{return res.json('hi')}
);

// GET a single ticket by ID
router.get("/:id", [verifyToken, checkRoleForTicket(false)], getTicket   );

// CREATE a new ticket
router.post("/", [upload.none(),verifyToken, checkRoleForTicket(false)], createTicket);

// UPDATE a ticket by ID
router.patch("/:id",[upload.none(),  verifyToken,checkRoleForTicket(false)  /* ,getTicket,*/ ], updateTicket);

// DELETE a ticket by ID
router.delete("/:id",[ verifyToken],  deleteTicket);

module.exports = router;
