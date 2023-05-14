const User = require('../models/user.model');

const isAdmin = async (req,res,next)=>{
    (req.user.role == "admin" )
     ? next() 
     : res.status(403).json({message:"only admins"});

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
    isAdmin,isAdminOrTechnicianIsMe
}