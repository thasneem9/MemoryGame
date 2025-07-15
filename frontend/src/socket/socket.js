// src/socket/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: true,   // optional but safe
  transports: ['websocket'], // ⚠️ recommended to force stable transport
});

export default socket;
