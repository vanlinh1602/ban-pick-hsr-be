import startServer from 'server';

require('dotenv-flow').config();

global.ProductID = 'BanPickHSR';

startServer({
  cors: {
    origin: [],
  },
  // session: {
  //   secret: 'dev',
  //   store: process.env.DB_SRV ?? '',
  // },
  port: process.env.PORT ?? '',
  databases: {
    tournament: {
      srv: process.env.DB_SRV ?? '',
      indexes: {},
    },
  },
});
