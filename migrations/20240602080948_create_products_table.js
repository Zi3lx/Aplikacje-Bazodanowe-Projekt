// migrations/{timestamp}_create_products_table.js

exports.up = function(knex) {
  return knex.schema.createTable('products', table => {
    table.increments('id').primary();
    table.string('name').notNull();
    table.integer('price').notNull();
    table.string('description');
    table.integer('user_id').unsigned().notNull();
    table.foreign('user_id').references('users.id');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products');
};
