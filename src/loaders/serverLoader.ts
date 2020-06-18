// to use types of express
import express from 'express';
// middlewares
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import jwtMiddleware from '../lib/middlewares/jwt';

import api from '../api';

function serverInit(app: express.Application): express.Application {
  // [middlewares]
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(jwtMiddleware);

  // [routes]
  app.use('/api', api);
  return app;
}

export default serverInit;
