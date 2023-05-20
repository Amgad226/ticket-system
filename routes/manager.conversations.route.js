const express = require("express");
const router = express.Router();
const {getConversations,getConversation ,deleteConversation,getConversationMessages,storeConversationMessage}=require('../controllers/manager.conversation.controller');
const {verifyToken} = require("../middlewares/auth.middleware");
const {handleSendByFormData}=require('../middlewares/form-data.middleware')

const {isAdmin,isUser ,isManager,isManagerOrUser,ManagerOwnerTheChat}=require('../middlewares/roles.middlewre');
const {isManagerOrUserOwner,validationConversation ,findConversation} = require("../middlewares/manager.conversation.middleware");


// GET all manager_conversation
router.get("/", [verifyToken, isManagerOrUser] ,getConversations);

// GET a single manager_conversation by ID
router.get("/:id", [verifyToken,validationConversation,findConversation,isManagerOrUserOwner], getConversation);
// router.get("/:id", validationConversation);

/**
 * create manager_conversation created automatic when assign ticket to technician 
*/

// Delete a conversation by ID
router.delete("/:id", [verifyToken ,isManager ], deleteConversation);


router.post("/message", [handleSendByFormData,verifyToken ,validationConversation,findConversation ,isManagerOrUserOwner ], storeConversationMessage);

// GET a messages of  manager_conversation by ID
router.get("/:id/messages", [verifyToken,isManagerOrUser], getConversationMessages);


module.exports=router;