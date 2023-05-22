const socket = require('socket.io');
const http = require('http');
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const RouteNotFound= require('./middlewares/not-found');
const {connectDB} = require('./database/query')
const seed = require('./database/seeder/seed');
const crypto = require('crypto');
require('dotenv').config();
const port = (process.env.PORT || 3000);



var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users.route");
var ticketsRouter = require("./routes/tickets.route");
var commentsRouter = require("./routes/comments.route");
var techniciansRouter = require("./routes/technicians.route");
var adminConversationsRouter =require("./routes/admin.conversations.route");
var managerConversationsRouter =require("./routes/manager.conversations.route");
const { check } = require('./middlewares/auth.middleware');
const Recipient = require('./models/recipient.model');
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

/*---------------------------------------------------------------------------------------------------------------*/
const server = http.createServer(app);

const io =socket(server,{cors:"*"})
// Generate hashed client secret
const hashedSecret = crypto.createHash('sha256').update(process.env.CLIENT_SECRET_SOCKET_IO).digest('hex');


/**
 * These middleware functions ensure that clients connecting to the Socket.IO server authenticate themselves
 * by providing a matching hashed secret and a valid JWT token. 
 * They help control access to the server and ensure that only authenticated and authorized clients are allowed to establish connections.
 */

io.use((socket, next) => {
  const clientHashedSecret = socket.handshake.auth.hashedSecret;

  if (clientHashedSecret === hashedSecret) {
    next();
  } else {
    next(new Error('Authentication error you must send valid hash secret '));
  }
});

io.use(async (socket, next) => {

  const authHeader = socket.handshake.auth.token;
  
  const token = authHeader&& authHeader.split(' ')[1]
  // console.log(token);
  if (token) {
      const result  = await check(token);
      if(result.success==false ) return next(new Error(result.message));
      else next();
  }
  else {
    // No token provided
    return next(new Error('Authentication error invalid  token provided'));
  }
});

io.on('connection', (socket) => {
  socket.emit('user-id', 'user-connection','new user connection');

  socket.on('disconnect', () => {
    console.log('disconnect');
    socket.broadcast.emit('user-id','user-disconnect', 'user disconnect');
  });

/**
 * when client open the chat and listen on new message and append it ,he must send event on socket server on read_message
 * with message_id for make this message read and if don't do it the client cant send message to admin because 
 * client cant send more than process.env.MAXIMUM_MESSAGES messages without admin read 
 */
  socket.on('read_message', message_id => {
    Recipient.findOneAndUpdate({message:message_id},{read_at:Data.now()});
});

});

/*---------------------------------------------------------------------------------------------------------------*/

async function start (){
  await connectDB();
  await seed()
  server.listen(port,()=>{
    console.log(`server running on ${port}`);
  });
}
start()  

