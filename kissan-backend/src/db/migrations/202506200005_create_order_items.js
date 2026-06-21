/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable()
      .references('id').inTable('orders').onDelete('CASCADE');
    table.integer('product_id').unsigned().notNullable()
      .references('id').inTable('products').onDelete('RESTRICT');
    table.integer('farmer_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('RESTRICT');
    table.decimal('quantity_kg', 10, 2).notNullable();
    table.decimal('price_per_kg', 10, 2).notNullable();
    table.decimal('subtotal', 12, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('order_items');
};
