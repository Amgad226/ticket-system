const express = require("express");
const router = express.Router();
const {   getConversations,getConversation,
          createConversation, deleteConversation,
          getConversationMessages,storeConversationMessage
          }=require('../controllers/admin.conversation.controller');

const { verifyToken} = require("../middlewares/auth.middleware");
const {handleSendByFormData}=require('../middlewares/form-data.middleware')
const {isAdmin,isUser}=require('../middlewares/roles.middlewre');
const {isAdminOrUserOwner,validationConversation,findConversation}=require('../middlewares/admin.conversation.middleware');


// GET all conversations
router.get("/", [verifyToken, isAdmin ],  getConversations);

// GET a single conversation by ID
router.get("/:id", [verifyToken,validationConversation,findConversation,isAdminOrUserOwner], getConversation);

// CREATE a new conversation 
router.post("/", [verifyToken ,isUser], createConversation);
//in this case user create chats with admin and admin can't create chat with user 

// Delete a conversation by ID
router.delete("/:id", [verifyToken ,isAdmin], [validationConversation,findConversation,deleteConversation]);


router.post("/message", [handleSendByFormData,verifyToken ,validationConversation,findConversation,isAdminOrUserOwner], storeConversationMessage);

// GET a messages of  manager_conversation by ID
router.get("/:id/messages", [verifyToken,validationConversation,findConversation,isAdminOrUserOwner], getConversationMessages);



module.exports=router;