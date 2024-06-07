exports.seed = async function(knex) {
  await knex('orders').delete(); 
  await knex('products').delete(); 
  await knex('cart_items').delete();
  await knex('users').delete();

  // Wstawianie przykładowych danych
  await knex('users').insert([
    {
      id: 1,
      first_name: 'Jan',
      last_name: 'Kowalski',
      email: 'jan.kowalski@example.com',
      password:'password123',
      role: 'customer'
    },
    {
      id: 2,
      first_name: 'Anna',
      last_name: 'Nowak',
      email: 'anna.nowak@example.com',
      password: 'password123',
      role: 'customer'
    },
    {
      id: 3,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      password: 'admin',
      role: 'admin'
    },
    {
      id: 4,
      first_name: 'a',
      last_name: 'a',
      email: 'a@a.com',
      password: 'a',
      role: 'manager'
    }
  ]);
};
