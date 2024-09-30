import http from 'http';
import { Server } from 'socket.io';

import {
  answer,
  endStream,
  iceCandidate,
  joinRoom,
  leaveRoom,
  offer,
  syncMatch,
  syncUserAction,
} from './events';

export default (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? '*' : [/tournament.kuma.id.vn/],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('join_room', (data) => joinRoom(socket, data));
    socket.on('leave_room', (data) => leaveRoom(socket, data));
    socket.on('syncMatch', (data) => syncMatch(socket, data));
    socket.on('syncUserAction', (data) => syncUserAction(socket, data));

    socket.on('offer', (data) => offer(socket, data));

    socket.on('ice-candidate', (data) => iceCandidate(socket, data));

    socket.on('answer', (data) => answer(socket, data));

    socket.on('end-stream', (data) => endStream(socket, data));
  });

  return io;
};
