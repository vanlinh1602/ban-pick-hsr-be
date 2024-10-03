import http from 'http';
import { set, unset } from 'lodash';
import { AppData, WebRtcTransport } from 'mediasoup/node/lib/types';
import { createRouter, createWebRtcTransport } from 'server/webRTC';
import { Server } from 'socket.io';

import { joinRoom, leaveRoom, syncMatch, syncUserAction } from './events';

export default async (server: http.Server) => {
  const router = await createRouter();

  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? '*' : [/tournament.kuma.id.vn/],
      methods: ['GET', 'POST'],
    },
  });

  const transports: CustomObject<{
    info: {
      producerIds: CustomObject<string>;
    };
    producer: WebRtcTransport<AppData>;
    consumer: CustomObject<WebRtcTransport<AppData>>;
  }> = {};

  io.on('connection', async (socket) => {
    socket.on('join_room', (data) => joinRoom(socket, data));
    socket.on('leave_room', (data) => leaveRoom(socket, data));
    socket.on('syncMatch', (data) => syncMatch(socket, data));
    socket.on('syncUserAction', (data) => syncUserAction(socket, data));

    // streaming
    socket.on('getRtpCapabilities', (calback) => {
      const { rtpCapabilities } = router;
      calback({ rtpCapabilities });
    });

    socket.on(
      'createWebRtcTransport',
      async (
        { player, room, viewerId }: { player: boolean; room: string; viewerId: string },
        callback
      ) => {
        if (player) {
          const transport = await createWebRtcTransport(router, callback);
          transport?.on('@close', async () => {
            const matchUpdate = await Services.matches.updateMatch(room, { isLive: false });
            const { _id, ...matchData } = matchUpdate;
            socket.to(room).emit('updateMatch', { id: _id, ...matchData });
            unset(transports, room);
          });
          set(transports, `${room}.producer`, transport);
        } else {
          const transport = await createWebRtcTransport(router, callback);
          set(transports, `${room}.consumer.${viewerId}`, transport);
        }
      }
    );

    socket.on('transport-connect', async ({ dtlsParameters, room }) => {
      await transports[room].producer.connect({ dtlsParameters });
    });

    socket.on('transport-produce', async ({ kind, rtpParameters, room, appData }, callback) => {
      const producer = await transports[room].producer.produce({
        kind,
        rtpParameters,
        appData,
      });
      producer.on('transportclose', () => {
        producer.close();
      });
      set(transports, `${room}.info.producerIds.${kind}`, producer.id);
      callback({
        id: producer.id,
      });
    });

    socket.on('transport-recv-connect', async ({ dtlsParameters, room, viewerId }) => {
      await transports[room].consumer[viewerId].connect({ dtlsParameters });
    });

    socket.on('consume', async ({ rtpCapabilities, room, viewerId }, callback) => {
      try {
        const params: CustomObject<{
          id: string;
          producerId: string;
          kind: string;
          rtpParameters: any;
        }> = {};
        await Promise.all(
          Object.entries(transports[room].info.producerIds).map(async ([kind, producerId]) => {
            if (router.canConsume({ producerId, rtpCapabilities })) {
              const consumer = await transports[room].consumer[viewerId].consume({
                producerId,
                rtpCapabilities,
                paused: true,
              });

              consumer.on('transportclose', () => {
                consumer.close();
              });

              consumer.on('producerclose', () => {
                consumer.close();
              });

              params[kind] = {
                id: consumer.id,
                producerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
              };
              await consumer.resume();
            }
          })
        );
        unset(transports, `${room}.consumer${viewerId}`);
        callback(params);
      } catch (error: any) {
        Logger.error(`Match: ${room} - consume error: ${error}`);
        callback({
          params: {
            error,
          },
        });
      }
    });
  });

  return io;
};
