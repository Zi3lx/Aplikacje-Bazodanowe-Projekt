// seeds/04_cart_items.js
exports.seed = async function(knex) {
  // Delete all existing entries from the cart_items table
  await knex('cart_items').delete();
  
  // Insert new seed entries
  await knex('cart_items').insert([
    { id: 1, user_id: 1, product_id: 1, quantity: 2 }, 
    { id: 2, user_id: 1, product_id: 2, quantity: 1 }, 
    { id: 3, user_id: 2, product_id: 3, quantity: 1 }
  ]);
};
