import dotenv from 'dotenv';
import { z } from 'zod';

export function createConfig() {
  dotenv.config();

  const config = z
    .object({
      DATABASE_URL: z.string(),
      NODE_ENV: z
        .enum(['development', 'staging', 'production', 'testing'])
        .default('development'),
      PORT: z.string().default('9000'),
    })
    .parse(process.env);

  return config;
}

export type IConfig = ReturnType<typeof createConfig>;
