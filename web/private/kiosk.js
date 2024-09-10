const socket = io();
let kioskPeer, kioskStream, clientVideo, kioskVideo;

kioskVideo = document.getElementById('remoteVideo');

InitKiosk();

// Signal when receiving a signal
socket.on('offer', (data) => {
    kioskPeer.signal(data);
});


function InitKiosk() {
    if (kioskPeer){
        kioskPeer.destroy();
    }

    // Create a new peer connection
    kioskPeer = new SimplePeer({
        initiator: false,
        trickle: false,
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