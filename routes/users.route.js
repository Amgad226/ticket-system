const express = require("express");
const router = express.Router();const {getUsers, getUser ,addUser,updateUser,deleteUser}=require('../controllers/user.controller')
const {login, logout,token,whoIsMe,getAccessTokenFromRefresh}=require('../controllers/auth.controller')
const { verifyToken} = require("../middlewares/auth.middleware");
const {handleSendByFormData}=require('../middlewares/form-data.middleware')


const {isNotUser,isUserOwnerOrAbove}=require('../middlewares/roles.middlewre');

router.get("/whoIsMe", [verifyToken] , whoIsMe);

// Get all users
router.get("/",[ verifyToken,isNotUser ], getUsers);

// Get one user by ID
router.get("/:id", [ verifyToken,isUserOwnerOrAbove],getUser);

// Create a new user
router.post("/",[ handleSendByFormData,verifyToken ] ,addUser );

// handle if send PATCH request on users without id in url
router.patch('/', (req, res) => {  return res.status(400).json({ message: 'You must provide an ID in the URL.' });});

// Update a user by ID
router.patch("/:id", [ handleSendByFormData,verifyToken] ,updateUser);

// Delete a user by ID
router.delete("/:id", [verifyToken], deleteUser);

// Login
router.post("/token", [ handleSendByFormData], token);



// Login
router.post("/login",[handleSendByFormData], login);

// Get new Access token from Refresh token
router.post("/refresh-token",[handleSendByFormData], getAccessTokenFromRefresh);

// Logout
router.post("/logout", [verifyToken],logout);

module.exports = router;