/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 80).notNullable().unique();
    table.string('slug', 80).notNullable().unique();
    table.string('icon', 10);
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('categories');
};
