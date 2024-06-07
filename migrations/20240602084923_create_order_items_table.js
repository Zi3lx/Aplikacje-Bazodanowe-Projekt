exports.up = function(knex) {
    return knex.schema.createTable('order_items', table => {
      table.increments('id').primary();
      table.integer('order_id').unsigned().notNull();
      table.foreign('order_id').references('orders.id').onDelete('CASCADE');
      table.integer('product_id').unsigned().notNull();
      table.foreign('product_id').references('products.id').onDelete('CASCADE');
      table.integer('quantity').unsigned().notNullable().defaultTo(1);
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('order_items');
  };