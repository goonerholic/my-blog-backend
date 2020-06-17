import express from 'express';
import mongoInit from './mongoLoader';
import serverInit from './serverLoader';

interface LoaderOptions {
  app: express.Application;
  mongoUri: string;
  port: number;
}

async function loaderInit({ app, mongoUri, port }: LoaderOptions) {
  await mongoInit(mongoUri);
  serverInit(app);

  app.listen(port, () => {
    console.log('Server initialized.');
  });
}

export default loaderInit;
