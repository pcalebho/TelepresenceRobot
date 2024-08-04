const express = require('express');
const ffmpeg = require('fluent-ffmpeg')
const PORT = 3000;
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index');
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(PORT)