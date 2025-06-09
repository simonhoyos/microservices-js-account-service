import fs from 'fs/promises';
import morgan from 'morgan';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import path from 'path';

import { logger } from '../logger-logstash.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE_PATH = path.join(__dirname, '../../combined.log');

const morganFormat = JSON.stringify({
  method: ':method',
  url: ':url',
  status: ':status',
  responseTime: ':response-time ms',
});

export async function morganMiddleware() {
  const logFileStream = await fs
    .open(LOG_FILE_PATH, 'a')
    .then((file) => file.createWriteStream());

  return morgan(morganFormat, {
    stream: {
      write: (message) => {
        const parsedMessage = JSON.parse(message.trim());

        logger.info('Request received for logging', parsedMessage);

        logFileStream.write(`${message}\n`);
      },
    },
  });
}
