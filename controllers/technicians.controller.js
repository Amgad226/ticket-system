
const asyncWrapper=require('../middlewares/async')
const User = require('../models/user.model');
const Ticket = require('../models/ticket.model');

const {validator}= require('../validator/validator');
const {userIdInParams}= require('../validator/user.validation');
const {createTechnicianValidation,nameToSearch}= require('../validator/technician.validation');

const _ = require('lodash');


const getTechnicians=asyncWrapper(async (req, res) => {
    const users = await User.find({role:"technician"});
    res.json(users);
});



const getTechnician=asyncWrapper(async (req, res,next) => {

    const { errors, statusCode ,fail} = await validator(userIdInParams)(req,res,next);
    if(fail) throw ({errors:errors.id ,statusCode:statusCode});

    const user = await User.find({role:"technician" , _id:req.params.id});
    res.json(user);
});


const createTechnician=asyncWrapper(async (req, res,next) => {

    const { errors, statusCode ,fail} = await validator(createTechnicianValidation)(req,res,next);
    if(fail) throw ({errors:errors ,statusCode:statusCode});
   


    const fieldsToCreate = _.pick(req.body, [
        'username',
        'password',
        'name',
        'position',
        'phone',
        'region',
        'street',
        'city',
        'zipCode',
        'noteAddress'
      ]);
    fieldsToCreate.role="technician";


    const user=new User(fieldsToCreate);

    const newUser = await user.save();

    return res.status(201).json(newUser);
});

const deleteTechnician=asyncWrapper(async (req, res,next) => {

    const { errors, statusCode ,fail} = await validator(userIdInParams)(req,res,next);
    if(fail) throw ({errors:errors ,statusCode:statusCode});
  
    await User.findByIdAndDelete(req.params.id);
  accept
    res.json({
      success: 1,
      message: "Data deleted successfully.",
    });
});

const getTechnicianTickets=asyncWrapper(async (req, res,next) => {

    const tickets = await Ticket.find({
        technician:req.user.id
});
   return  res.json(tickets);

});


const searchOnTechnicianByName=asyncWrapper(async (req, res,next) => {
    const { errors, statusCode ,fail} = await validator(nameToSearch)(req,res,next);

    if(fail) throw ({errors:errors ,statusCode:statusCode});
    
    const name = req.body.name;

    const technician_by_name = await User.find({ name: { $regex: name, $options: "i" } ,role:"technician"  });

    return res.status(200).json(technician_by_name)


})
module.exports={
    getTechnicians,
    getTechnician,
    createTechnician,
    deleteTechnician,
    getTechnicianTickets,
    searchOnTechnicianByName

}