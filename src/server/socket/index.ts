import http from 'http';
import { Server } from 'socket.io';

import { joinRoom, leaveRoom, syncMatch } from './events';

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

    // socket.on('stream', (data) => {
    //   socket.broadcast.emit('stream', data);
    // });
  });

  return io;
};
