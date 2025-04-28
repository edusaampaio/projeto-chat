const jwt = require('jsonwebtoken');

function socketHandler(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Token ausente'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.user.username}`);

    socket.on('chat message', (msg) => {
      io.emit('chat message', { user: socket.user.username, msg });
    });

    socket.on('disconnect', () => {
      console.log(`Usuário desconectado: ${socket.user.username}`);
    });
  });
}

module.exports = socketHandler;
