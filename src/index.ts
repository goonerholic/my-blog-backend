import express from 'express';
import { config } from './config';
import loaderInit from './loaders/index';

const { port, mongoUri } = config;

(async function main() {
  const app = express();
  await loaderInit({ app, mongoUri, port });
})();
