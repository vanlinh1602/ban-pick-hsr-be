import * as mediasoup from 'mediasoup';
import { AppData, Router } from 'mediasoup/node/lib/types';

export const createRouter = async () => {
  const worker = await mediasoup.createWorker({
    rtcMinPort: 40000,
    rtcMaxPort: 49999,
    logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
    logLevel: 'warn',
  });
  const router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
    ],
  });
  return router;
};

export const createWebRtcTransport = async (
  router: Router<AppData>,
  callback: (data: {
    params: {
      id?: string;
      iceParameters?: any;
      iceCandidates?: any;
      dtlsParameters?: any;
      error?: any;
    };
  }) => void
) => {
  try {
    // https://mediasoup.org/documentation/v3/mediasoup/api/#router-createWebRtcTransport
    const transport = await router.createWebRtcTransport({
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp:
            process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'tournament.kuma.id.vn',
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });
    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState === 'closed') {
        transport.close();
      }
    });

    transport.on('@close', () => {
      Logger.info('transport closed');
    });

    callback({
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
      params: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
      },
    });

    return transport;
  } catch (error) {
    callback({
      params: {
        error,
      },
    });
    return null;
  }
};
