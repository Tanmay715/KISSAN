/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 120).notNullable();
    table.string('email', 180).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('role', 20).notNullable();
    table.string('phone', 20);
    table.text('address');
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('users');
};
