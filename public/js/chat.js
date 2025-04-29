const socket = io();

function sendMessage() {
  const input = document.getElementById('msgInput');
  socket.emit('chatMessage', input.value);
  input.value = '';
}