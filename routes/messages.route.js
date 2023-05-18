const express = require("express");
const router = express.Router();
// const {}=require('../controllers/technicians.controller');
const { verifyToken} = require("../middlewares/auth.middleware");

const {handleSendByFormData}=require('../middlewares/form-data.middleware')

const {isAdmin,isUser,isAdminOrUser,isAdminOrUserOwner}=require('../middlewares/roles.middlewre');


// GET all messages
router.get("/:conversation_id", [verifyToken ], (req,res)=>{});

// CREATE a new message in conversation 
router.post("/", [handleSendByFormData,verifyToken ], (req,res)=>{});


module.exports=router;