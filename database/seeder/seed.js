const managerConversations=require('./managerConversation.seeder')
const users=require('./user.seeder')
const tickets=require('./ticket.seeder')
 
const User  =require('../../models/user.model')
const Ticket  =require('../../models/ticket.model')
const ManagerConversation  =require('../../models/managerConversation.model')

async function seed(){
    console.log('start seed data')
    var admin =await User.findOne({ role: "admin" });
    if(admin==null){
        await User.insertMany(users)
        await Ticket.insertMany(tickets)
        await ManagerConversation.insertMany(managerConversations)
        console.log('  data seeded')
    }
    else{
        console.log(' already  data seeded')
    }


}
module.exports=seed