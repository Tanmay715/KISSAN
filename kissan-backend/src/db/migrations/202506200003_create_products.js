/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.integer('farmer_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('category_id').unsigned().notNullable()
      .references('id').inTable('categories').onDelete('RESTRICT');
    table.string('name', 150).notNullable();
    table.text('description');
    table.decimal('price_per_kg', 10, 2).notNullable();
    table.decimal('quantity_kg', 10, 2).notNullable();
    table.string('unit', 20).notNullable().defaultTo('kg');
    table.string('location', 120);
    table.string('image_url', 500);
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('products');
};
