import express from 'express';

import { createConfig } from './config.ts';
import { connect, disconnect } from './database.ts';
import { router as routerV1 } from './routes/v1/index.ts';
import type { IApp } from './types.ts';

export async function createApp() {
  const destroyers: (() => Promise<unknown>)[] = [];
  const app = express() as IApp;

  const config = createConfig();

  app.config = config;
  app.services = app.services ?? {};

  const databaseConnection = connect();

  app.services.connectionPool = databaseConnection.pool;

  destroyers.push(() =>
    disconnect({ globalCache: databaseConnection.globalCache }),
  );

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
