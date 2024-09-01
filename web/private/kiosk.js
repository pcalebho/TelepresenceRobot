const socket = io();
let kioskPeer, kioskStream, clientVideo, kioskVideo;

const tabletCameraURL = 'http://192.168.1.102:4747/video';

kioskVideo = document.getElementById('remoteVideo');
kioskVideo.src = tabletCameraURL;


// Request user media
localVideo.onloadedmetadata = () => {
    // Capture the MediaStream from the video element
    const stream = localVideo.captureStream();
    
    // Display the video on the kiosk (if needed)
    document.body.appendChild(localVideo);
    
    // Set up the WebRTC peer connection with the captured stream
    setupPeerConnection(stream);
};


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