const express = require("express");
const router = express.Router();
const {  getConversations,getConversation ,deleteConversation,getConversationMessages}=require('../controllers/manager.conversation.controller');
const { verifyToken} = require("../utils/utils");
const {upload} =require('../multer')

const {isAdmin,isUser ,isManager,isManagerOrUser,ManagerOwnerTheChat}=require('../middlewares/admin.middlewre');


// GET all manager_conversation
router.get("/", [verifyToken, isManagerOrUser ] ,getConversations);

// GET a single manager_conversation by ID
router.get("/:id", [verifyToken,isManagerOrUser], getConversation);


// GET a messages of  manager_conversation by ID
router.get("/:id/messages", [verifyToken,isManagerOrUser], getConversationMessages);

/**
 * xxxxxx CREATE a new manager_conversation xxxxx
 * create manager_conversation created automatic when assign ticket to technician 
 * 
 */

// Delete a conversation by ID
router.delete("/:id", [verifyToken ,isManager ,ManagerOwnerTheChat], deleteConversation);


module.exports=router;