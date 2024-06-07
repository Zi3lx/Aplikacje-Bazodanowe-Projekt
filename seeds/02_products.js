// seeds/02_products.js
exports.seed = async function(knex) {
  // Delete all existing entries from the products table
  await knex('products').delete();
  await knex('cart_items').delete();
  
  // Insert new seed entries
  await knex('products').insert([
    { id: 1, name: 'Product 1', price: 10, description: 'Description for product 1', user_id: 1 },
    { id: 2, name: 'Product 2', price: 20, description: 'Description for product 2', user_id: 2 },
    { id: 3, name: 'Product 3', price: 30, description: 'Description for product 3', user_id: 3 },
  ]);
};
