// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let connectedUser = null; // Store the ID of the currently connected user

// Serve static files from the "public" directory
app.use(express.static('public'));  
app.use(express.static('private'))

  
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);


    //when receiving an offer from 
    socket.on('offer', (offer) => {
        console.log('Offer: ', offer)
        socket.broadcast.emit('offer', offer)
    });
    socket.on('answer',(answer) => {
        console.log('Answer: ', answer)
        socket.broadcast.emit('answer', answer)
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', connectedUser);
    });
});


server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
