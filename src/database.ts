import knexCreate from 'knex';

// @ts-expect-error - no types support for js modules
import knexConfig from './knexfile.js';
import type { IGlobalCache } from './types.ts';

export function connect(opts: { globalCache: IGlobalCache }) {
  const { globalCache } = opts;

  const knex = globalCache.knex ?? knexCreate(knexConfig);

  if (globalCache.knex == null) {
    globalCache.knex = knex;
  }

  return {
    knex: globalCache.knex,

    async cleanup() {
      await knex.destroy();

      globalCache.knex = undefined;
    },
  };
}
