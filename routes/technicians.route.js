const express = require("express");
const router = express.Router();
const {getTechnicians ,getTechnician,createTechnician,deleteTechnician}=require('../controllers/technicians.controller');
const { verifyToken,  checkRoleForTicket} = require("../utils/utils");
const {upload} =require('../multer')

const {isAdmin,isAdminOrMe}=require('../middlewares/admin.middlewre');
// GET all technician
router.get("/", [verifyToken ,isAdmin], getTechnicians);

// GET a single ticket by ID
router.get("/:id", [verifyToken,isAdminOrMe], getTechnician   );

// CREATE a new ticket
router.post("/", [upload.none(),verifyToken ,isAdmin], createTechnician);

// Delete a user by ID
router.delete("/:id", [verifyToken ,isAdmin], deleteTechnician);


module.exports=router;
