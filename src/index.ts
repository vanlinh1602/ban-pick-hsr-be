import { WithoutId } from 'mongodb';
import startServer from 'server';
import { Config } from 'services/configs';

require('dotenv-flow').config();

global.ProductID = 'BanPickHSR';

const server = startServer({
  cors: {
    origin: [/tournament.kuma.id.vn/],
  },
  // session: {
  //   secret: 'dev',
  //   store: process.env.DB_SRV ?? '',
  // },
  port: process.env.PORT ?? '',
  databases: {
    tournament: {
      srv: process.env.DB_SRV ?? '',
      indexes: {
        matchs: {
          spec: { tournamentId: 1 },
        },
      },
    },
  },
});

Services.configs.queryConfigs().then((configs) => {
  const storeConfigs = configs.reduce((acc, config) => {
    const { _id, ...rest } = config;
    acc[_id] = rest;
    return acc;
  }, {} as CustomObject<WithoutId<Config>>);
  global.Resources = {
    configs: storeConfigs,
  };
});

if (process.env.NODE_ENV !== 'development') {
  const gracefullShutdown = async () => {
    server.close();
  };
  process.on('SIGTERM', async () => {
    await gracefullShutdown();
  });
  process.on('SIGINT', async () => {
    await gracefullShutdown();
  });
  process.on('SIGQUIT', async () => {
    await gracefullShutdown();
  });
  process.once('SIGUSR2', async () => {
    await gracefullShutdown();
  });
}
