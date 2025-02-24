import type { Express } from 'express';
import type { Knex } from 'knex';

import type { IConfig } from './config.ts';

export interface IApp extends Express {
  config: IConfig;
  services: {
    connectionPool: Knex;
  };
}
