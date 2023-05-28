const { ticketIdInParams } = require("../validator/ticket.validation");
const { validator } = require("../validator/validator");
const asyncWrapper = require("./async");


const ticketValidation = asyncWrapper( async(req,res,next)=>{
        await validator(ticketIdInParams)(req,res,next);
        next();
    })

module.exports={
    ticketValidation,
}