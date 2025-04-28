require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    socketHandler(io);
    server.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
