// migrations/{timestamp}_create_cart_items_table.js
exports.up = function(knex) {
    return knex.schema.createTable('cart_items', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNull();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.integer('product_id').unsigned().notNull();
      table.foreign('product_id').references('products.id').onDelete('CASCADE');
      table.integer('quantity').unsigned().notNullable().defaultTo(1);
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('cart_items');
  };
  