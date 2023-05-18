const express = require("express");
const router = express.Router();
const {getTechnicians ,getTechnician,createTechnician,deleteTechnician,getTechnicianTickets,searchOnTechnicianByName}=require('../controllers/technicians.controller');
const {handleSendByFormData}=require('../middlewares/form-data.middleware')

const { verifyToken} = require("../middlewares/auth.middleware");

const {isTechnician,isAdminOrManagerOrTechnicianIsMe, isAdminOrManager}=require('../middlewares/roles.middlewre');

//get all tickets that technician have
// isTechnician check if the user logged in is technician or manager
router.get("/getTickets", [verifyToken, isTechnician ], getTechnicianTickets);



// GET all technician
// isAdminOrManager check if the user logged in is admin or manager
router.get("/", [verifyToken ,isAdminOrManager], getTechnicians);

// GET a single technician by ID
//isAdminOrManagerOrTechnicianIsMe check if the user logged in is admin or manager or technician and  this technician i searched for it is me 
router.get("/:id", [verifyToken,isAdminOrManagerOrTechnicianIsMe], getTechnician   );


// CREATE a new technician
// handleSendByFormData for use from data in post man when send data in body [form data] 
// isAdminOrManager the user logged in is admin or manager
router.post("/", [handleSendByFormData,verifyToken ,isAdminOrManager], createTechnician);


// Delete a technician by ID
// isAdminOrManager check if the user logged in is admin or manager
router.delete("/:id", [verifyToken ,isAdminOrManager], deleteTechnician);


// search a new technician
// isAdminOrManager check if the user logged in is admin or manager
router.post("/search", [handleSendByFormData,verifyToken ,isAdminOrManager], searchOnTechnicianByName);






module.exports=router;
