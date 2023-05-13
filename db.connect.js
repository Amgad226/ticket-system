const mongoose = require("mongoose");

const connectDB = (url)=>{
return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }); 
}
module.exports={connectDB};
// const db = mongoose.connection;

// db.on("connected", () => {
//   console.log("Connected to MongoDB!");
// });

// db.on("error", (error) => {
//   console.log("Error connecting to MongoDB:", error);
// });

// db.on("disconnected", () => {
//   console.log("Disconnected from MongoDB.");
// });