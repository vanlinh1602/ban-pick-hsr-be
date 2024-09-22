import startServer from 'server';

require('dotenv-flow').config();

global.ProductID = 'BanPickHSR';

startServer({
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
