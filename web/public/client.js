// public/client.js
const socket = io();
let connectedUser = null;
let localPeer, localStream, kioskVideo, clientVideo;

kioskVideo = document.getElementById('remoteVideo');
clientVideo = document.getElementById('localVideo');

// Request user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStream = stream;
        clientVideo.srcObject = localStream;
        
        InitPeer();

        // Signal when receiving a signal
        socket.on('answer', (data) => {
            localPeer.signal(data);
        });

    })
    .catch((err) => {
        console.error('Error accessing media devices.', err);
    });

function InitPeer() {
    if (localPeer){
        localPeer.destroy();
    }

    // Create a new peer connection
    localPeer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: localStream
    });

    // Send signals to the other peer
    localPeer.on('signal', (data) => {
        socket.emit('offer', data);
        console.log("Offer: ", data)
    });

    // Add the remote stream
    localPeer.on('stream', (stream) => {
        kioskVideo.srcObject = stream;
    });

    localPeer.on('close', () => {
        console.log('Peer connection closed');
        InitPeer();
    });
}