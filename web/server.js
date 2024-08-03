const express = require('express');
const PORT = 3000;
// const socketIo = require('socket.io');
// const SimplePeer = require('simple-peer');

const app = express();
// const io = socketIo(server);

app.use(express.static(__dirname + '/public'));
// app.use('/scripts',express.static(__dirname+'./node_modules/'));

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('signal', (data) => {
//     io.emit('signal', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
