/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('buyer_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('status', 20).notNullable().defaultTo('pending');
    table.decimal('total_amount', 12, 2).notNullable();
    table.text('shipping_address').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('orders');
};
