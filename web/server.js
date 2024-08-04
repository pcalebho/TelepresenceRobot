const express = require('express');
const PORT = 3000;
const ffmpeg = require('fluent-ffmpeg')
const socketIo = require('socket.io');
// const SimplePeer = require('simple-peer');

const app = express();
// const io = socketIo(server);

app.use(express.static(__dirname + '/public'));

app.get('/remoteVideo', (req, res) => {
    res.setHeader('Content-Type', 'video/mp4');
        const ffmpegProcess = ffmpeg('/dev/video4')
        .inputFormat('v4l2')
        .outputOptions([
            '-movflags frag_keyframe+empty_moov', // Helps with streaming
            '-preset fast' // Adjusts encoding speed/quality
        ])
        // .videoCodec('libx264')
        .on('end', () => {
        console.log('Streaming finished.');
    })
    // .on('error', (err) => {
    // console.error('An error occurred:', err);
    // })
    .pipe(res, { end: true });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
