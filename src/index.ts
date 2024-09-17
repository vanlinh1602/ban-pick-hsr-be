import startServer from 'server';

require('dotenv-flow').config();

global.ProductID = 'Kuma API';

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
    simulator: {
      srv: process.env.DB_SRV ?? '',
      indexes: {
        cookies: {
          spec: { email: 1 },
        },
      },
    },
  },
});
