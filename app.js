var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');//none
const {notFound} = require('./middlewares/not-found');
require('dotenv').config();
const {connectDB}= require('./db.connect')
const {errorHandlerMiddleware} = require('./middlewares/error-handler');


const User = require("./models/user.model");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users.route");
var ticketsRouter = require("./routes/tickets.route");
var commentsRouter = require("./routes/comments.route");
var techniciansRouter = require("./routes/technicians.route");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tickets", ticketsRouter);
app.use("/comments", commentsRouter);
app.use("/technicians", techniciansRouter);

// error handler 
// app.use(errorHandlerMiddleware);

// not Found route 
// app.use(notFound);


// connect on DataBase 
// connectDB(process.env.DATABASE_URI)
const uri =  process.env.DATABASE_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB!");
});

db.on("error", (error) => {
  console.log("Error connecting to MongoDB:", error);
});

db.on("disconnected", () => {
  console.log("Disconnected from MongoDB.");
});
// check if an admin user already exists
User.findOne({ role: "admin" })
  .then((admin) => {
    // if an admin user does not exist, create one
    if (!admin) {
      const adminUser = new User({
        // name: "Admin",
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


app.listen(process.env.PORT || 3000 , ()=>{
  console.log(`the server listening on ${process.env.PORT || 3000 } port`);
})
// module.exports = app;
