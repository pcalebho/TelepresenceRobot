const express = require('express');
const PORT = 3000;
const ffmpeg = require('fluent-ffmpeg')
// const socketIo = require('socket.io');
// const SimplePeer = require('simple-peer');

const app = express();
// const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get('/remoteVideo', (req, res) => {
res.setHeader('Content-Type', 'video/mp4');
    const ffmpegProcess = ffmpeg()
        .input('/dev/video0') // Adjust the device path if necessary
        .inputFormat('v4l2')
        .videoCodec('libx264')
        .format('mp4')
        .on('end', () => {
        console.log('Streaming finished.');
    })
    .on('error', (err) => {
    console.error('An error occurred:', err);
    })
    .pipe(res, { end: true });
});

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
