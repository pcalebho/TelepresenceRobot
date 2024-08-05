const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localVideo.srcObject = stream;

    const peer = new SimplePeer({
      initiator: location.hash === '#init',
      trickle: false,
      stream: stream
    });

    peer.on('signal', data => {
      socket.emit('signal', data);
    });

    peer.on('stream', stream => {
      remoteVideo.srcObject = stream;
    });

    socket.on('signal', data => {
      peer.signal(data);
    });
  })
  .catch(error => {
    console.error('Error accessing media devices.', error);
  });