import express from 'express';
import { config } from './config';
import loaderInit from './loaders/index';
// import createFakeData from './test/createFakeData';

const { port, mongoUri } = config;

(async function main() {
  const app = express();
  await loaderInit({ app, mongoUri, port });

  // for test
  // await createFakeData(40);
})();
