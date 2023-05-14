const jwt = require("jsonwebtoken");
const Ticket = require("../models/ticket.model");
// const User = require("../models/user.model");
const RevokedToken = require('../models/revokedToken.model');

async function getUser(req, res, next) {
  console.log('unused middleware');
    next();

  // let user;

  // try {
  //   user = await User.findById(req.params.id);
  //   if (user == null) {
  //     return res.status(404).json({ message: "Cannot find user" });
  //   }
  // } catch (err) {
  //   return res.status(500).json({ message: err.message });
  // }

  // res.user = user;
  // next();
}

// Middleware function to get a ticket by ID
async function storeTicketInRes(req, res, next) {
  
    
    // const ticket =await Ticket.findById(req.params.id );
    // if(ticket ==null)   return res.status(404).json({ message: "Ticket not found" });

    next();
    

}

// Middleware to verify JWT token
async function verifyToken(req, res, next) {
  // const token = req.header('token')
  const authHeader = req.header("authorization");
  const accessToken = authHeader&& authHeader.split(' ')[1]
  if (!accessToken) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Verify token
  try {
    
    // check if the access token is revoked
    const isAccessTokenRevoked = await RevokedToken.findOne({ token: accessToken });

    // check if the refresh token is revoked
    // const isRefreshTokenRevoked = await RevokedToken.findOne({ token: refreshToken });

    if (isAccessTokenRevoked ) {
      // deny access to the user
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded.userPayload;
    next();
  } catch (err) {
   return  res.status(401).json({ message: "Invalid Access Token , token was expired" });
  }
}

/**
 * 
 *
 *  
1. If the user is an admin, grant access.
2. If the user is not an admin, but the route is private and the user's id is the same as the id in the route parameter, grant access.
3. If the user is not an admin, but the role is included in the roles array, grant access.
4. Otherwise, deny access. 
*/

function checkRoleForUser(roles, isPrivate) {
  // console.log('outer log');
  return function (req, res, next) {

      // console.log('inner log');
      // next()
      const userRole = req.user.role;
      const userId = req.user.id;
      const idParam = req.params.id;

      if (userRole === "admin") {
        next();
      } else if (isPrivate && userId === idParam) {
        next();
      } else if (roles.includes(userRole)) {
        next();
      } else {
        
      return res.status(403).json({ message: "Access denied" });
      }
    
  };
}

/* Here is the explanation for the code above:
1. We are creating a function that takes a boolean argument.
2. The function returns another function that takes three arguments (req, res, next).
3. The returned function checks if the user role is "user" and if userIsNotAllowd is true. If it is, we respond with a 403 status code and a message informing the user that they do not have access to the ticket.
4. If it is not true, we check if the user role is "user" and if the ticket customer is not equal to the user id. If it is, we respond with a 403 status code and a message informing the user that they do not have access to the ticket.
5. If both are false, we call next() to move on to the next middleware function. */

function checkRoleForTicket(userIsNotAllowd = false) {
  return async function (req, res, next) {
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole === "user" && userIsNotAllowd) {
      res.status(403).json({ message: "Access denied, it is not your ticket" });
    } else if (userRole === "user" && req.params.id) {
      const idTicket = req.params.id;
      const ticket = await Ticket.findById(idTicket);
      if (ticket?.customer.toString() !== userId || userIsNotAllowd) {
        res
          .status(403)
          .json({ message: "Access denied, it is not your ticket" });
      } else {
        next();
      }
    } else {
      next();
    }
  };
}


async function getComment(req, res, next) {
  let comment;

  try {
    comment = await Comment.findById(req.params.id);
    if (comment == null) {
      return res.status(404).json({ message: "Comment not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.comment = comment;
  next();
}

function updateUserDTO() {
  return async function (req, res, next) {
    const userRole = req.user.role;
    const userId = req.user.id;
    const idParam = req.params.id;
    if (userRole === "admin") {
      next();
    } else if (userId === idParam) {
      const { username, _id, role, ...rest } = req.body;
      req.body = rest;
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
}

module.exports = {
  getUser,
  verifyToken,
  checkRoleForUser,
  // getTicket,
  checkRoleForTicket,
  getComment,
  updateUserDTO,
  storeTicketInRes,
};
