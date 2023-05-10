const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const app = express();
const wsServer = new WebSocket.Server({ noServer: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

const server = app.listen(3000, () => {
  console.log('Servidor Express rodando na porta 3000');
});

wsServer.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
    socket.send(`Eco: ${message}`);
  });

  socket.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request);
  });
});

