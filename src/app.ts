import express from 'express';

import { createConfig } from './config.ts';
import { connect as databaseConnect } from './database.ts';
import { connect as kafkaConnect } from './modules/kafka.ts';
import { router as routerV1 } from './routes/v1/index.ts';
import type { IApp, IGlobalCache } from './types.ts';

const globalCache: IGlobalCache = {};

export async function createApp() {
  const destroyers: (() => Promise<unknown>)[] = [];
  const app = express() as IApp;

  const config = createConfig();

  app.config = config;
  app.services = app.services ?? {};

  const { knex, cleanup: knexCleanup } = databaseConnect({ globalCache });

  app.services.knex = knex;

  destroyers.push(() => knexCleanup());

  const { consumerModule, cleanup: kafkaCleanup } = kafkaConnect({
    globalCache,
    config,
  });

  destroyers.push(() => kafkaCleanup());

  const { cleanup: kafkaConsumerCleanup } = await consumerModule({
    conn: knex,
  });

  destroyers.push(() => kafkaConsumerCleanup());

  app.use(express.json());

  app.get('/health-check', (_req, res) => {
    res.status(200).json({ success: true });
  });

  app.use('/v1', routerV1);

  async function cleanup() {
    return Promise.all(destroyers.map((destroy) => destroy()));
  }

  return { app, port: config.PORT, cleanup };
}
