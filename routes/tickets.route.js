const express = require("express");
const router = express.Router();
const {getTickets ,getTicket , createTicket ,updateTicket ,deleteTicket ,giveToTheTechnician}=require('../controllers/ticket.controller');
const { verifyToken,  checkRoleForTicket} = require("../utils/utils");
const {upload} =require('../multer')
const {isAdmin,isAdminOrMe}=require('../middlewares/admin.middlewre');

// GET all tickets
router.get("/", [verifyToken, checkRoleForTicket(true)], getTickets);

// GET a single ticket by ID
router.get("/:id", [verifyToken, checkRoleForTicket(false)], getTicket   );

// CREATE a new ticket
router.post("/", [upload.none(),verifyToken, checkRoleForTicket(false)], createTicket);

// handle if send PATCH request on users without id in url
router.patch('/', (req, res) => {  return res.status(400).json({ message: 'You must provide an ID in the URL.' });});

// UPDATE a ticket by ID
router.patch("/:id",[upload.none(),  verifyToken,checkRoleForTicket(false)  /* ,getTicket,*/ ], updateTicket);

// DELETE a ticket by ID
router.delete("/:id",[ verifyToken],  deleteTicket);


// Give ticket To The Technician
router.post("/giveToTheTechnician/:id", [upload.none(),verifyToken,isAdmin], [giveToTheTechnician]);


module.exports = router;
