const http = require('http')
const path = require('path')
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js')
const express = require('express');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users.js')
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')))
const admin = 'Admin'
io.on('connection',socket=>{
  socket.on('joinRoom', ({username, room})=>{
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)

    //to sigle client
    socket.emit('message', formatMessage(admin, 'Welcome to ChatRoom'));

  //broadcast to all the client beside the user itself
    socket.broadcast.to(user.room).emit('message', formatMessage(admin,`${user.username} has joined the chat`));

    io.to(user.room).emit('roomUsers',{
      room: user.room,
      users:getRoomUsers(user.room)
    })


  })

  //io.emit(), to every one include the user

  //listen for chatMessage

  socket.on('chatMessage',(msg)=>{
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username,msg))
  })

  socket.on('disconnect', ()=>{
    const user = userLeave(socket.id);
    if(user){
      io.to(user.room).emit('message', formatMessage(admin,`${user.username} has left the chat`))
    }

    io.to(user.room).emit('roomUsers',{
      room: user.room,
      users:getRoomUsers(user.room)
    })


  });

})



const PORT = process.env.PORT || 3000;
server.listen( PORT, ()=>{
  console.log('server running on port' + PORT)
})