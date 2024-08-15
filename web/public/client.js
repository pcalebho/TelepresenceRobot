// public/client.js
const socket = io();
let localPeer, localStream, kioskVideo, clientVideo;

kioskVideo = document.getElementById('remoteVideo');
clientVideo = document.getElementById('localVideo');

// Request user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStream = stream;
        clientVideo.srcObject = stream;

        // Create a new peer connection
        localPeer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: localStream
        });

        // Signal when receiving a signal
        socket.on('signal', (data) => {
            localPeer.signal(data.signal);
        });

        // Send signals to the other peer
        localPeer.on('signal', (data) => {
            socket.emit('signal', { signal: data, target: connectedUser });
        });

        // Add the remote stream
        localPeer.on('stream', (stream) => {
            kioskVideo.srcObject = stream;
        });

        // Handling connection established
        socket.on('ready', (data) => {
            connectedUser = data;
            localPeer = new SimplePeer({
                initiator: false,
                trickle: false,
                stream: localStream
            });
        });

        socket.on('waiting', () => {
            window.location.href = '/waiting.html';
        });
    })
    .catch((err) => {
        console.error('Error accessing media devices.', err);
    });
