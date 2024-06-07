// seeds/05_order_items.js
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('order_items').delete();
  
  // Insert seed entries
  await knex('order_items').insert([
    { order_id: 1, product_id: 1, quantity: 2 },
    { order_id: 1, product_id: 2, quantity: 1 },
    { order_id: 2, product_id: 3, quantity: 1 }
  ]);
};
