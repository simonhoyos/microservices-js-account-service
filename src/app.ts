import express from 'express';
import type { Knex } from 'knex';

import { type IConfig, createConfig } from './config.ts';
import { connect, disconnect } from './database.ts';

interface IApp extends express.Express {
  config: IConfig;
  services: {
    connectionPool: Knex;
  };
}

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

  app.get('/', (_req, res) => {
    res.send('Hello World!');
  });

  async function cleanup() {
    return Promise.all(destroyers.map((destroy) => destroy()));
  }

  return { app, port: config.PORT, cleanup };
}
