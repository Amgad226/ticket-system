const express = require("express");
const router = express.Router();
const {getTechnicians ,getTechnician,createTechnician,deleteTechnician,getTechnicianTickets,searchOnTechnicianByName}=require('../controllers/technicians.controller');
const { verifyToken,  checkRoleForTicket} = require("../utils/utils");
const {upload} =require('../multer')

const {isAdmin,isAdminOrTechnicianIsMe}=require('../middlewares/admin.middlewre');

// get the technician's assigned tickets 
router.get("/getTickets", [verifyToken, /* middleware for check if i am Technician */ ], getTechnicianTickets);

// GET all technician
// isAdmin check if the user logged in is admin
router.get("/", [verifyToken ,isAdmin], getTechnicians);

// GET a single technician by ID
//isAdminOrTechnicianIsMe check if the user logged in is admin or this technician is me 
router.get("/:id", [verifyToken,isAdminOrTechnicianIsMe], getTechnician   );

// CREATE a new technician
// upload.none() for use from data in post man when send data in body 
router.post("/", [upload.none(),verifyToken ,isAdmin], createTechnician);

// Delete a technician by ID
router.delete("/:id", [verifyToken ,isAdmin], deleteTechnician);

// search a new technician
router.post("/search", [upload.none(),verifyToken ,isAdmin], searchOnTechnicianByName);




module.exports=router;
