const router = require("./router");

const {   getConversations,getConversation,
          createConversation, deleteConversation,
          getConversationMessages,storeConversationMessage
          }=require('../controllers/admin.conversation.controller');

const { verifyToken} = require("../middlewares/auth.middleware");
const {handleSendByFormData}=require('../middlewares/form-data.middleware')
const {isAdmin,isUser}=require('../middlewares/roles.middlewre');
const {isAdminOrUserOwner,findAndValidationConversation}=require('../middlewares/admin.conversation.middleware');


// GET all conversations
router.get("/", [verifyToken, isAdmin ],  getConversations);

// GET a single conversation by ID
router.get("/:id", [verifyToken,findAndValidationConversation(true),isAdminOrUserOwner], getConversation);

// CREATE a new conversation 
router.post("/", [handleSendByFormData,verifyToken ,isUser], createConversation);
//in this case user create chats with admin and admin can't create chat with user 

// Delete a conversation by ID
router.delete("/:id", [verifyToken ,isAdmin], [findAndValidationConversation(true),deleteConversation]);


router.post("/message", [handleSendByFormData,verifyToken ,findAndValidationConversation(false),isAdminOrUserOwner], storeConversationMessage);

// GET a messages of  manager_conversation by ID
router.get("/:id/messages", [verifyToken,findAndValidationConversation(true),isAdminOrUserOwner], getConversationMessages);



module.exports=router;