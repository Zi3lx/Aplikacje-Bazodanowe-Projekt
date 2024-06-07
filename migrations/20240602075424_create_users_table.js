exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('first_name').notNull();
      table.string('last_name').notNull();
      table.string('email').notNull().unique();
      table.string('password').notNull();
      table.string('role').notNull();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  