const express = require("express");
const router = express.Router();
// const {}=require('../controllers/technicians.controller');
const { verifyToken} = require("../utils/utils");
const {upload} =require('../multer')

const {isAdmin,isUser,isAdminOrUser,isAdminOrUserOwner}=require('../middlewares/admin.middlewre');


// GET all messages
router.get("/:conversation_id", [verifyToken ], (req,res)=>{});

// CREATE a new message in conversation 
router.post("/", [upload.none(),verifyToken ], (req,res)=>{});


module.exports=router;