import winston from 'winston';

import { IGlobalCache } from './types';

export function createLogger(opts: { globalCache: IGlobalCache }) {
  const { globalCache } = opts;

  const logger =
    globalCache.logger ??
    winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',

      defaultMeta: {
        service: 'account-microservice',
        buildInfo: {
          version: '1.0.0',
          nodeVersion: process.version,
        },
      },

      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp(),
          ),
          filename: 'combined.log',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp(),
          ),
          filename: 'error.log',
          level: 'error',
        }),
      ],
    });

  if (globalCache.logger == null) {
    globalCache.logger = logger;
  }

  return {
    logger: globalCache.logger,
  };
}
