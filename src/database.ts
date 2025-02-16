import knex, { type Knex } from 'knex';

// @ts-expect-error - no types support with modules
import knexConfig from './knexfile.js';

export type IGlobalCache = {
  knex?: Knex;
};

const _globalCache: IGlobalCache = {};

export function connect(opts: { globalCache?: IGlobalCache } = {}) {
  const { globalCache = _globalCache } = opts;

  if (globalCache.knex == null) {
    globalCache.knex = knex(knexConfig);
  }

  return {
    pool: globalCache.knex,
    globalCache,
  };
}

export async function disconnect(opts: { globalCache: IGlobalCache }) {
  const { globalCache } = opts;

  if (globalCache.knex != null) {
    globalCache.knex.destroy();
    globalCache.knex = undefined;
  }
}
