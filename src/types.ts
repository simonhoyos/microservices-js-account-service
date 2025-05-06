import type { Express } from 'express';
import type { Kafka } from 'kafkajs';
import type { Knex } from 'knex';

import type { IConfig } from './config.ts';

export interface IApp extends Express {
  config: IConfig;
  services: {
    knex: Knex;

    kafka: Kafka;
  };
}

export type IGlobalCache = {
  knex?: Knex;

  kafka?: Kafka;
};
