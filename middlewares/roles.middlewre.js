const Ticket = require('../models/ticket.model');
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
const isNotUser = async (req,res,next)=>{
  (req.user.role != "user" )
   ? next() 
   : res.status(403).json({message:"only user"});

}
const isTechnician = async (req,res,next)=>{
  (req.user.role == "technician" )
  ? next() 
  : res.status(403).json({message:"only technician"});

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

const isAdminOrManager = async (req,res,next)=>{
  (req.user.role == "admin" ||req.user.role == "manager"  )
   ? next() 
   : res.status(403).json({message:"only admin and managers"});
}

const isUserAndNotTicketOwner = async (req,res,next)=>{
  if(req.user.role == "user" )
  {
    var ticket_id =req.params.id; 
    var ticket = await Ticket.findById(ticket_id);
    if(ticket.customer!=req.user.id){
        return res.status(403).json({message: "its not your ticker"})
    }
  }
  return next(); 


}



const isAdminOrUser = async (req,res,next)=>{
  (req.user.role == "admin"  || req.user.role == "user"  )
   ? next() 
   : res.status(403).json({message:"only admin | user "});

}

const isUserOwnerOrAbove = async (req,res,next)=>{

  if(req.user.role == "user" && req.user.id != req.params.id)
  return res.status(403).json({message:"access denied"});
  
  return next();
  


  (req.user.role == "admin"  || req.user.role == "user"  )
   ? next() 
   : res.status(403).json({message:"only admin | user "});

}



const isAdminOrManagerOrTechnicianIsMe= async (req,res,next)=>{
    const userRole = req.user.role;
    const userId = req.user.id;
    const idParam = req.params.id;

    if (userRole === "admin" || userRole === "manager" ) {
      return next();
    }

    else if (userRole === "technician" && (idParam === userId)) {
        return next();
    }

    return res.status(403).json({ message: "Access denied" });

}


module.exports={
    isAdmin,
    isManager,
    isUser,
    isUserOwnerOrAbove,
    isNotUser,
    isTechnician,
    isAdminOrManager,
    isAdminOrUser,
    isManagerOrUser,
    isAdminOrManagerOrTechnicianIsMe,
    isAdminOrUserOwner,
    ManagerOwnerTheChat,
    isUserAndNotTicketOwner,
}