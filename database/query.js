const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const DB = require('./connect')
const connectDB=async()=>{
// console.log(1);

const db =  await DB(process.env.DATABASE_URI);


db.on("connected", () => {
  console.log("Connected to MongoDB!");
});
// 
db.on("error", (error) => {
  console.log("Error connecting to MongoDB:", error);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB.");
});

}
const checkExistAdmin = async()=>{
    // console.log(2);

    User.findOne({ role: "admin" })
  .then((admin) => {
    // if an admin user does not exist, create one
    if (!admin) {
      const adminUser = new User({
        _id:'111111111111111111111111',
        name: "Admin",
        username:"Admin",
        email: "admin@example.com",
        password: "password",
        role: "admin",
        phone:"09456",
        region:" "

      });
      adminUser.save();
      console.log("Admin user created");
    }
    else{
      console.log("we have admin");
    }
  })
  .catch((err) => {
    console.error("Error checking for admin user:", err);
});

}


const findOrCreate = async (model, query, createData) => {
    // Try to find the document based on the query
    var response ={
        document:'',
        action:''
    };
    let document = await model.findOne(query);
  
    // If the document exists, return it
    if (document) {
        response.document=document
        response.action='find'
      return response
    }
//   console.log('create');
    // If the document doesn't exist, create it
    document = await model.create(createData);
    response.document=document
    response.action='create'
    // Return the newly created document
    return response
};

module.exports={
    findOrCreate,
    connectDB,
    checkExistAdmin
}