const {getUsers, getUser ,addUser,updateUser,deleteUser}=require('../controllers/user.controller')
const {login, logout,token,getAccessTokenFromRefresh}=require('../controllers/auth.controller')
const { verifyToken} = require("../middlewares/auth.middleware");

const {upload} =require('../multer')
const express = require("express");
const router = express.Router();

const {isNotUser,isUserOwnerOrAbove}=require('../middlewares/roles.middlewre');

// Get all users
router.get("/",[ verifyToken,isNotUser ], getUsers);

// Get one user by ID
router.get("/:id", [ verifyToken,isUserOwnerOrAbove],getUser);

// Create a new user
router.post("/",[ upload.none(),verifyToken] ,addUser );

// handle if send PATCH request on users without id in url
router.patch('/', (req, res) => {  return res.status(400).json({ message: 'You must provide an ID in the URL.' });});

// Update a user by ID
router.patch("/:id", [ upload.none(),verifyToken] ,updateUser);

// Delete a user by ID
router.delete("/:id", [verifyToken], deleteUser);

// Login
router.post("/token",[upload.none()], token);

// Login
router.post("/login",[upload.none()], login);

// Get new Access token from Refresh token
router.post("/refresh-token",[upload.none()], getAccessTokenFromRefresh);

// Logout
router.post("/logout", [verifyToken],logout);

module.exports = router;