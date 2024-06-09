// migrations/{timestamp}_create_orders_table.js

exports.up = function(knex) {
  return knex.schema.createTable('orders', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNull();
    table.foreign('user_id').references('users.id');
    table.timestamp('order_date').defaultTo(knex.fn.now());
    table.enu('status', ['pending', 'shipped', 'delivered', 'cancelled']).defaultTo('pending');
    table.timestamps(true, true);
  });
};
  
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('orders');
};
    