const socket = io();

function sendMessage() {
  const input = document.getElementById('msgInput');
  socket.emit('chatMessage', input.value);
  input.value = '';
}
socket.on('chatMessage', msg => {
    const div = document.getElementById('messages');
    const p = document.createElement('p');
    p.innerText = msg;
    div.appendChild(p);
  });