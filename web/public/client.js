// public/client.js
const socket = io();
let connectedUser = null;
let clientPeer, clientStream, kioskVideo, clientVideo;

kioskVideo = document.getElementById('remoteVideo');
clientVideo = document.getElementById('localVideo');

const tabletVideoURL = "http://192.168.1.102:8080/video";

// Request user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        clientStream = stream;
        clientVideo.srcObject = clientStream;
        
        InitPeer();

        // Signal when receiving a signal
        socket.on('answer', (data) => {
            clientPeer.signal(data);
        });

    })
    .catch((err) => {
        console.error('Error accessing media devices.', err);
    });

function InitPeer() {
    if (clientPeer){
        clientPeer.destroy();
    }

    // Create a new peer connection
    clientPeer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: clientStream
    });

    // Send signals to the other peer
    clientPeer.on('signal', (data) => {
        socket.emit('offer', data);
        console.log("Offer: ", data)
    });

    clientPeer.on('connect', () => {
        kioskVideo.src = tabletVideoURL;
    })
    // // Add the remote stream
    clientPeer.on('stream', (stream) => {
        // kioskVideo.srcObject = stream;
    });

    clientPeer.on('close', () => {
        console.log('Peer connection closed');
        InitPeer();
    });
}