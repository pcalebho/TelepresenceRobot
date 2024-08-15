const socket = io();
let kioskPeer, kioskStream, clientVideo, kioskVideo;

kioskVideo = document.getElementById('remoteVideo');

// Request user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        kioskStream = stream;

        // Create a new peer connection
        kioskPeer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream: kioskStream
        });

        // Signal when receiving a signal
        socket.on('offer', (data) => {
            kioskPeer.signal(data);
        });

        // Send signals to the other peer
        kioskPeer.on('signal', (data) => {
            socket.emit('answer', data);
        });

        // Add the remote stream
        kioskPeer.on('stream', (stream) => {
            kioskVideo.srcObject = stream;
        });
              
    })
    .catch((err) => {
        console.error('Error accessing media devices.', err);
    });
