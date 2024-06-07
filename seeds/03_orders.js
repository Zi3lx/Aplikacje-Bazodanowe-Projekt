// seeds/03_orders.js
exports.seed = async function(knex) {
  await knex('orders').delete();
  await knex('orders').insert([
    { id: 1, user_id: 1, status: 'pending' },
    { id: 2, user_id: 2, status: 'shipped' },
    { id: 3, user_id: 3, status: 'delivered' }
  ]);
};
