/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  client: 'postgresql',
  connection: {
    connectionString: process.env.DATABASE_URL,
    host: 'localhost',
    port: 5432,
    database: 'account_service_dev',
    user: 'postgres',
    password: 'password',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
};
