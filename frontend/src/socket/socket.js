// src/socket/socket.js
import { io } from 'socket.io-client';

const socket = io('http://54.179.69.173:5000', {
  autoConnect: true,   // optional but safe
  transports: ['websocket'], // ⚠️ recommended to force stable transport
});

export default socket;
