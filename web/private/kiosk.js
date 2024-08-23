const socket = io();
let kioskPeer, kioskStream, clientVideo, kioskVideo;

kioskVideo = document.getElementById('remoteVideo');

// Request user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        kioskStream = stream;
        
        InitKiosk();

        // Signal when receiving a signal
        socket.on('offer', (data) => {
            kioskPeer.signal(data);
        });              
    })
    .catch((err) => {
        console.error('Error accessing media devices.', err);
    });


function InitKiosk() {
    if (kioskPeer){
        kioskPeer.destroy();
    }

    // Create a new peer connection
    kioskPeer = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: kioskStream
    });

    // Send signals to the other peer
    kioskPeer.on('signal', (data) => {
        socket.emit('answer', data);
    });

    // Add the remote stream
    kioskPeer.on('stream', (stream) => {
        kioskVideo.srcObject = stream;
    });

    kioskPeer.on('close', () => {
        console.log('Peer connection closed');
        InitKiosk();
    });
}