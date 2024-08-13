// public/kiosk.js
const socket = io();
let kioskPeer, localStream, remoteVideo, localVideo;

remoteVideo = document.getElementById('remoteVideo');

// Request user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStream = stream;

        // Create a new peer connection
        kioskPeer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream: localStream
        });

        // Signal when receiving a signal
        socket.on('signal', (data) => {
            kioskPeer.signal(data.signal);
        });

        // Send signals to the other peer
        kioskPeer.on('signal', (data) => {
            socket.emit('signal', { signal: data, target: connectedUser });
        });

        // Add the remote stream
        kioskPeer.on('stream', (stream) => {
            remoteVideo.srcObject = stream;
        });

        // Handling connection established
        socket.on('ready', (data) => {
            connectedUser = data;
        });

        socket.on('clear_queue', () => {
            window.location.href = '/kiosk.html';
        });
    })
    .catch((err) => {
        console.error('Error accessing media devices.', err);
    });
