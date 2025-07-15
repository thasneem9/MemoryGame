// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let waitingUser = null;

io.on('connection', (socket) => {
  console.log('🟢 New socket connected:', socket.id);

 socket.on('findMatch', (user) => {
  console.log('📩 Received findMatch from:', user, 'Socket ID:', socket.id);

  if (waitingUser) {
    const opponent = waitingUser;
    waitingUser = null;

    console.log(`✅ Matching ${user.name} (${socket.id}) with ${opponent.name} (${opponent.socketId})`);

io.to(opponent.socketId).emit('matchFound', { ...user, socketId: socket.id });
console.log(`📤 Emitted matchFound to opponent (${opponent.socketId})`);

io.to(socket.id).emit('matchFound', { ...opponent });
console.log(`📤 Emitted matchFound to user (${socket.id})`);


  } else {
    waitingUser = { ...user, socketId: socket.id };
    console.log(`⏳ No opponent yet. Waiting user set: ${user.name} (${socket.id})`);
  }
});
socket.on('connect', () => {
  console.log('🧷 Connected to socket:', socket.id);
});



  socket.on('disconnect', () => {
    if (waitingUser?.socketId === socket.id) {
      console.log(`❌ Disconnected while waiting: ${waitingUser.name}`);
      waitingUser = null;
    } else {
      console.log('🔌 Socket disconnected:', socket.id);
    }
  });
});

server.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});
