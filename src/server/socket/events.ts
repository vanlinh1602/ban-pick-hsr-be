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
    const matchUpdate = await Services.matches.updateMatch(id, rest);
    const { _id, ...matchData } = matchUpdate;
    socket.to(room).emit('updateMatch', { id: _id, ...matchData });
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

export const iceCandidate = (socket: Socket, data: any) => {
  try {
    if (!data.room) {
      return;
    }
    const { room, ...rest } = data;
    socket.to(room).emit('ice-candidate', { ...rest });
  } catch (error) {
    /* empty */
  }
};

export const offer = (socket: Socket, data: any) => {
  try {
    if (!data.room) {
      return;
    }
    const { room, ...rest } = data;
    socket.to(room).emit('offer', { ...rest });
  } catch (error) {
    /* empty */
  }
};

export const answer = (socket: Socket, data: any) => {
  try {
    if (!data.room) {
      return;
    }
    const { room, ...rest } = data;
    socket.to(room).emit('answer', { ...rest });
  } catch (error) {
    /* empty */
  }
};

export const endStream = (socket: Socket, data: any) => {
  try {
    if (!data.room) {
      return;
    }
    const { room } = data;
    socket.to(room).emit('end-stream');
  } catch (error) {
    /* empty */
  }
};
