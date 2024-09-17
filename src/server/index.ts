import setupControllers from 'controllers';
import http from 'http';

import setupApp, { AppConfig } from './app';
import setupDatabases, { DatabasesConfig } from './databases';
import setupLogger from './logger';

export type Config = AppConfig & DatabasesConfig & { port: string };

export default (config: Config) => {
  global.Logger = setupLogger();
  global.Databases = setupDatabases(config);

  setupControllers();
  const app = setupApp(config);
  app.set('port', config.port);

  const server = http.createServer(app);
  server.listen(config.port);
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    switch (error.code) {
      case 'EACCES':
        Logger.error(`Port ${config.port} requires elevated privileges`);
        process.exit(1);
      // eslint-disable-next-line no-fallthrough
      case 'EADDRINUSE':
        Logger.error(`Port ${config.port} is already in use`);
        process.exit(1);
      // eslint-disable-next-line no-fallthrough
      default:
        throw error;
    }
  });
  server.on('listening', () => {
    server.keepAliveTimeout = 0;
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    Logger.info(`Listening on ${bind}`);
  });

  server.once('close', () => {
    Object.values(Databases).forEach((client) => {
      client.close();
    });
    global.Databases = {};
    process.exit(0);
  });

  return server;
};
