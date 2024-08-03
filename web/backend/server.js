const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const SimplePeer = require('simple-peer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
