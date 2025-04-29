// imports
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes'); // Importa as rotas de autenticação
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Usando as rotas de autenticação
app.use('/api/auth', authRoutes);

// Rota raiz personalizada
app.get('/', (req, res) => {
    res.send("Bem-vindo ao server!");
});

// Conectando ao Banco de Dados
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    socketHandler(io); // Configura o socket
    server.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error(err));
