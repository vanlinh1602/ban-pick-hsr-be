/* eslint-disable no-undef */
import bodyParser from 'body-parser';
import compression from 'compression';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import express, { Request, Response } from 'express';
import session from 'express-session';
import fs from 'fs';
import helmet from 'helmet';
import createError from 'http-errors';
import logger from 'morgan';
import fsPath from 'path';
import setupRoutes from 'routers';

export type AppConfig = {
  cors?: {
    origin: RegExp[];
  };
  session?: {
    secret: string;
    store: string;
  };
};

export default (config: AppConfig) => {
  const app = express();

  if (fs.existsSync(fsPath.join(__dirname, '/../public'))) {
    app.use(express.static(fsPath.join(__dirname, '/../public')));
  }
  app.use(compression());
  app.use(helmet());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === 'development' ? [/localhost/, /127.0.0.1/] : config.cors?.origin,
      credentials: true,
    })
  );

  app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));

  if (config.session) {
    app.use(
      session({
        name: ProductID,
        proxy: true,
        cookie:
          process.env.NODE_ENV === 'development'
            ? { secure: false }
            : {
                secure: true,
                sameSite: 'none',
              },
        secret: config.session.secret,
        store: MongoStore.create({
          mongoUrl: config.session.store,
          ttl: 14 * 24 * 60 * 60,
        }),
      })
    );
  }

  app.use(logger('dev'));

  app.set('views', fsPath.join(__dirname, '/../public/views'));
  app.set('view engine', 'pug');

  const indexRoute = express.Router();
  indexRoute.get('/', (req, res) => {
    res.render('index', { title: ProductID.toUpperCase() });
  });
  app.use('/', indexRoute);

  // const databasesRouter = express.Router();

  // app.use('/database', databasesRouter);

  const routes = setupRoutes();
  routes.forEach(({ path, router }) => {
    app.use(path, router);
  });

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError(404));
  });

  // eslint-disable-next-line unused-imports/no-unused-vars
  app.use((err: any, req: Request, res: Response, next: any) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
};
