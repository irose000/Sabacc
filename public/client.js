const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('message', (event) => {
    console.log('Message from server:', event.data);
    document.getElementById('message').textContent = event.data;
});

socket.addEventListener('open', () => {
    socket.send(JSON.stringify('Hello from the client'));
});