import { Socket } from 'socket.io';

export const joinRoom = (socket: Socket, room: string) => {
  return socket.join(room);
};

export const leaveRoom = (socket: Socket, room: string) => {
  return socket.leave(room);
};

export const syncMatch = async (socket: Socket, data: any) => {
  try {
    if (!data.room) {
      return;
    }
    const { room, match } = data;
    const { id, ...rest } = match;
    await Services.matchs.updateMatch(id, rest);
    socket.to(room).emit('updateMatch', match);
  } catch (error) {
    /* empty */
  }
};
