// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const dotenv=require('dotenv')

dotenv.config()
const PORT = process.env.PORT || 5000; 
const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const path = require('path');

// Serve frontend static files from React build (Vite’s dist folder)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any other route, serve index.html so React router works
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


let waitingUser = null;

io.on('connection', (socket) => {
  console.log('🟢 New socket connected:', socket.id);

  socket.on('findMatch', (user) => {
  if (waitingUser) {
    const opponent = waitingUser;
    waitingUser = null;

    const roomId = `room-${opponent.socketId}-${socket.id}`;

    // ✅ Join BOTH sockets to room
    socket.join(roomId);
    io.sockets.sockets.get(opponent.socketId)?.join(roomId); // ✅ fix!

    io.to(opponent.socketId).emit('matchFound', {
      ...user,
      socketId: socket.id,
      roomId,
    });

    io.to(socket.id).emit('matchFound', {
      ...opponent,
      roomId,
    });

    console.log(`🎮 Created room ${roomId} for ${opponent.socketId} & ${socket.id}`);
  } else {
    waitingUser = { ...user, socketId: socket.id };
  }
});


  // Listen for initial board (only 1 player should send it)
  socket.on('initBoard', ({ board, roomId }) => {
    socket.to(roomId).emit('boardInit', board);
  });

  // Flip card event
socket.on('flipCard', ({ cardId, roomId }) => {
  console.log(`🟠 flipCard received from ${socket.id} for card ${cardId} in ${roomId}`);
  const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
  console.log(`📦 Room ${roomId} has sockets:`, socketsInRoom ? [...socketsInRoom] : 'Not found');
  socket.to(roomId).emit('opponentFlipCard', cardId);
});
socket.on('switchTurn', ({ roomId, turn }) => {
  io.to(roomId).emit('switchTurn', { turn }); // ✅ emit to both players
});

  // Match found event
  socket.on('matchCards', ({ ids, roomId, player }) => {
    io.to(roomId).emit('cardsMatched', { ids, player });
  });
socket.on('unmatchCards', ({ ids, roomId }) => {
  console.log('❌ Received unmatchCards for room', roomId, 'ids:', ids);
  socket.to(roomId).emit('unmatchCards', { ids });
});

  socket.on('disconnect', () => {
    if (waitingUser?.socketId === socket.id) {
      waitingUser = null;
    }
  });
});



server.listen(PORT,'0.0.0.0', () => {
  console.log(` Server running on port ${PORT}`);
});
