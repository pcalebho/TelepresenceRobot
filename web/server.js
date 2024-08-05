const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.static('public'))


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('signal', (data) => {
    console.log('Signal received', data);
    socket.broadcast.emit('signal', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


server.listen(3000)