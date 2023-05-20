// async function all (){
const socket = require('socket.io');
const http = require('http');
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const RouteNotFound= require('./middlewares/not-found');
const {connectDB} = require('./database/query')
const seed = require('./database/seeder/seed');
const port = (process.env.PORT || 3000);
require('dotenv').config();


var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users.route");
var ticketsRouter = require("./routes/tickets.route");
var commentsRouter = require("./routes/comments.route");
var techniciansRouter = require("./routes/technicians.route");
var adminConversationsRouter =require("./routes/admin.conversations.route");
var managerConversationsRouter =require("./routes/manager.conversations.route");
var app = express();

app.use((req,res,next)=>{req.io=io;next();})

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
 
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tickets", ticketsRouter);
app.use("/comments", commentsRouter);
app.use("/technicians", techniciansRouter);
app.use("/admin/conversations", adminConversationsRouter);
app.use("/manager/conversations", managerConversationsRouter);

app.use(RouteNotFound);


const server = http.createServer(app);

const io =socket(server,{cors:"*"})
io.on('connection', (socket) => {
  socket.emit('user-id', 'user-connection','new user connection');

  socket.on('disconnect', () => {
    console.log('disconnect');
    socket.broadcast.emit('user-id','user-disconnect', 'user disconnect');
  });
});

async function start (){
  await connectDB();
  await seed()
}
async function listen(){
  server.listen(port,()=>{
    console.log(`server running on ${port}`);
  });
}
async function go() {
  await start()  
  await listen()
}
go()
