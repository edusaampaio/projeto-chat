// imports
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const hbs = require('hbs');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const socketHandler = require('./socket/socketHandler');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// config
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/layouts'));

app.use(express.static(path.join(__dirname, 'public')));

// Rotas 
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.render('login');
});

// Página de chat (com autenticação)
app.get('/chat', authMiddleware, (req, res) => {
  res.render('chat', { user: req.user });
});


socketHandler(io);

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado');
    server.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
