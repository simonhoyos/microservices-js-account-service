/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('account', (table) => {
    table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();

    table.timestamps(true, true);

    table.text('name').notNullable();
    table.text('number').notNullable();

    table.enum('type', ['root', 'sub']).defaultTo('root');
    table
      .enum('status', ['new', 'active', 'inactive', 'blocked'])
      .defaultTo('new');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('account');
}
