// public/client.js
const socket = io();
let connectedUser = null;
let localPeer, localStream, kioskVideo, clientVideo;

kioskVideo = document.getElementById('remoteVideo');
clientVideo = document.getElementById('localVideo');

// Request user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((clientStream) => {
        clientVideo.srcObject = clientStream;

        // Create a new peer connection
        localPeer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: clientStream
        });


        // Signal when receiving a signal
        socket.on('answer', (data) => {
            localPeer.signal(data);
        });

        // Send signals to the other peer
        localPeer.on('signal', (data) => {
            socket.emit('offer', data);
            console.log("Offer: ", data)
        });

        // Add the remote stream
        localPeer.on('stream', (stream) => {
            kioskVideo.srcObject = clientStream;
        });
    })
    .catch((err) => {
        console.error('Error accessing media devices.', err);
    });
