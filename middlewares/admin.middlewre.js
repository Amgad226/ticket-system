const User = require('../models/user.model');

const isAdmin = async (req,res,next)=>{
    (req.user.role == "admin" )
     ? next() 
     : res.status(403).json({message:"only admins"});

}
const isUser = async (req,res,next)=>{
  (req.user.role == "user" )
   ? next() 
   : res.status(403).json({message:"only user"});

}
const isManager = async (req,res,next)=>{
  (req.user.role == "manager" )
   ? next() 
   : res.status(403).json({message:"only manager"});

}
const isManagerOrUser = async (req,res,next)=>{
  (req.user.role == "manager" || req.user.role == "user" )
   ? next() 
   : res.status(403).json({message:"only manager | user"});

}
const ManagerOwnerTheChat = async (req,res,next)=>{
  (req.user.role == "manager" /* && manager is owner the chat */  )
   ? next() 
   : res.status(403).json({message:"only owner chat manager "});

}
const isAdminOrUserOwner = async (req,res,next)=>{
  (req.user.role == "admin" /* && user is owner the chat */  )
   ? next() 
   : res.status(403).json({message:"only owner chat user | user "});

}



const isAdminOrUser = async (req,res,next)=>{
  (req.user.role == "admin"  || req.user.role == "user"  )
   ? next() 
   : res.status(403).json({message:"only admin | user "});

}



const isAdminOrTechnicianIsMe= async (req,res,next)=>{
    const userRole = req.user.role;
    const userId = req.user.id;
    const idParam = req.params.id;

    if (userRole === "admin") {
      return next();
    }

    if (userRole === "technician") {
      const technician = await User.findById(idParam);
      if (technician && technician.id === userId) {
        return next();
      }
    }

    return res.status(403).json({ message: "Access denied" });

}

module.exports={
    isAdmin,
    isAdminOrTechnicianIsMe,
    isAdminOrUser,
    isUser,
    isAdminOrUserOwner,
    isManager,
    isManagerOrUser,
    ManagerOwnerTheChat
}