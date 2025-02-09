import knex, { type Knex } from 'knex';

// @ts-expect-error - no types support with modules
import knexConfig from './knexfile.js';

export type IGlobalCache = {
  knex?: Knex;
};

const _globalCache: IGlobalCache = {};

export function connect(opts: {
  environment?: keyof typeof knexConfig;
  globalCache?: IGlobalCache;
}) {
  const { globalCache = _globalCache, environment } = opts;

  if (globalCache.knex == null) {
    globalCache.knex = knex(knexConfig[environment]);
  }

  return globalCache.knex;
}

export function disconnect() {
  if (_globalCache.knex != null) {
    _globalCache.knex.destroy();
    _globalCache.knex = undefined;
  }
}
