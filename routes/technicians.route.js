const express = require("express");
const router = express.Router();
const {getTechnicians ,getTechnician,createTechnician,deleteTechnician,getTechnicianTickets,searchOnTechnicianByName}=require('../controllers/technicians.controller');
const { verifyToken,  checkRoleForTicket} = require("../utils/utils");
const {upload} =require('../multer')

const {isAdmin,isAdminOrMe}=require('../middlewares/admin.middlewre');


router.get("/getTickets", [verifyToken /* admin or me */], getTechnicianTickets);

// GET all technician
router.get("/", [verifyToken ,isAdmin], getTechnicians);

// GET a single technician by ID
router.get("/:id", [verifyToken,isAdminOrMe], getTechnician   );

// CREATE a new technician
router.post("/", [upload.none(),verifyToken ,isAdmin], createTechnician);

// Delete a technician by ID
router.delete("/:id", [verifyToken ,isAdmin], deleteTechnician);

// search a new technician
router.post("/search", [upload.none(),verifyToken ,isAdmin], searchOnTechnicianByName);




module.exports=router;
