const express = require("express");
const router = express.Router();
const {  getConversations,getConversation,createConversation,deleteConversation,getConversationMessages}=require('../controllers/admin.conversation.controller');
const { verifyToken} = require("../utils/utils");
const {upload} =require('../multer')

const {isAdmin,isUser,isAdminOrUser,isAdminOrUserOwner}=require('../middlewares/admin.middlewre');


// GET all conversations
router.get("/", [verifyToken, isAdminOrUser ],  getConversations);

// GET a single conversation by ID
router.get("/:id", [verifyToken,isAdminOrUserOwner], getConversation);

// GET a messages of  manager_conversation by ID
router.get("/:id/messages", [verifyToken,isAdminOrUserOwner], getConversationMessages);


// CREATE a new conversation 
router.post("/", [upload.none(),verifyToken ,isUser], createConversation);
//in this case user create chats with admin and admin cant create chat with user 

// Delete a conversation by ID
router.delete("/:id", [verifyToken ,isAdmin], deleteConversation);


module.exports=router;