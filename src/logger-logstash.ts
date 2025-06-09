import winston from 'winston';
// @ts-expect-error - library with no types support
import LogstashTransport from 'winston-logstash/lib/winston-logstash-latest.js';

const serviceName = 'account-microservice';

const logstashTransport = new LogstashTransport({
  host: 'localhost',
  port: 5000,
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),

  defaultMeta: {
    service: serviceName,
    buildInfo: {
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

    logstashTransport,
  ],
});
