const express = require("express");
const router = express.Router();
const {   getConversations,getConversation,
          createConversation, deleteConversation,
          getConversationMessages,storeConversationMessage
          }=require('../controllers/admin.conversation.controller');

const { verifyToken} = require("../middlewares/auth.middleware");
const {upload} =require('../multer')
const {isAdmin,isUser}=require('../middlewares/roles.middlewre');
const {isAdminOrUserOwner,findAndValidationConversation}=require('../middlewares/admin.conversation.middleware');


// GET all conversations
router.get("/", [verifyToken, isAdmin ],  getConversations);

// GET a single conversation by ID
router.get("/:id", [verifyToken,findAndValidationConversation(true),isAdminOrUserOwner], getConversation);

// CREATE a new conversation 
router.post("/", [upload.none(),verifyToken ,isUser], createConversation);
//in this case user create chats with admin and admin can't create chat with user 

// Delete a conversation by ID
router.delete("/:id", [verifyToken ,isAdmin], [findAndValidationConversation(true),deleteConversation]);


router.post("/message", [upload.none(),verifyToken ,findAndValidationConversation(false),isAdminOrUserOwner], storeConversationMessage);

// GET a messages of  manager_conversation by ID
router.get("/:id/messages", [verifyToken,findAndValidationConversation(true),isAdminOrUserOwner], getConversationMessages);



module.exports=router;