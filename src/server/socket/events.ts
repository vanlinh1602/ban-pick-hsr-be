import { Socket } from 'socket.io';
import { validParams } from 'utils/validator';

export const joinRoom = (socket: Socket, data: any) => {
  try {
    validParams(data, ['room']);

    const { room } = data;
    socket.join(room);
  } catch (error) {
    /* empty */
  }
};

export const leaveRoom = (socket: Socket, data: any) => {
  try {
    validParams(data, ['room']);

    const { room } = data;
    socket.leave(room);
  } catch (error) {
    /* empty */
  }
};

export const syncMatch = async (socket: Socket, data: any) => {
  try {
    if (!data.room) {
      return;
    }
    const { room, match } = data;
    const { id, ...rest } = match;
    await Services.matches.updateMatch(id, rest);
    socket.to(room).emit('updateMatch', match);
  } catch (error) {
    /* empty */
  }
};

export const syncUserAction = async (socket: Socket, data: any) => {
  try {
    if (!data.room) {
      return;
    }
    const { room, ...rest } = data;
    socket.to(room).emit('userAction', { ...rest });
  } catch (error) {
    /* empty */
  }
};
