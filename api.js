const knex = require('knex')(require('./knexfile').development);

const saveUser = async (user) => {
  await knex('users').insert({ ...user });
};

const deleteUser = async (userId) => {
  try {
    await knex('users').where({ id: userId }).del();
  } catch (error) {
    throw error;
  }
}

const updateUser = async (userId, user) => {
  try {
    await knex('users').where({ id: userId }).update({ ...user });
  } catch (error) {
    throw error;
  }
}

const getAllUsers = async (orderRoleFilter, userSort) => {
  let usersQuery = knex('users').select('*');

  if (orderRoleFilter) {
    usersQuery = usersQuery.where('role', orderRoleFilter);
  }
  if (userSort) {
    usersQuery = usersQuery.orderBy(userSort);
  }

  try {
    const users = await usersQuery;
    
    return users;
  } catch (error) {
    throw error;
  }
}

const getUserById = async (userId) => { 
  try {
    const user = await knex('users').where({ id: userId }).first();
    return user;
  } catch (error) {
    throw error;
  }
}

const loginUser =  async (email, password, res) => {
  try {
    const user = await knex('users').where({ email, password }).first();
    return user;
  } catch (error) {
    throw error;
  }
}

const insertToProducts = async (products, userId) => {
  try {
    await knex('products').insert(...products, { user_id: userId });
  } catch (error) {
    throw error;
  }
}

const getProducts = async (sortBy, page = 1, limit = 10) => {
  let query = knex('products');

  if (sortBy === 'name') {
    query = query.orderBy('name');
  } else if (sortBy === 'price') {
    query = query.orderBy('price');
  }

  const offset = (page - 1) * limit;

  const products = await query.offset(offset).limit(limit).select('*');
  const totalCount = await knex('products').count('* as count').first();
  const totalPages = Math.ceil(totalCount.count / limit);

  return { products, totalPages, currentPage: page };
};

const deleteProduct = async (productId) => {
  try {
    await knex('products').where({ id: productId }).del();
  } catch (error) {
    throw error;
  }
}

const getProductsById = async (productId) => {
  try {
    const product = await knex('products').where({ id: productId }).first();
    return product;
  } catch (error) {
    throw error;
  }
}

const updateProduct = async (productId, product) => {
  try {
    await knex('products').where({ id: productId }).update(product);
  } catch (error) {
    throw error;
  }
}

const getCartItems = async (userId) => {
  try {
    const cartItems = await knex('cart_items')
      .join('products', 'cart_items.product_id', 'products.id')
      .where('cart_items.user_id', userId)
      .select('cart_items.id', 'products.id', 'products.name', 'products.price', 'cart_items.quantity');
    return cartItems;
  } catch (error) {
    throw error;
  }
}

async function updateCart(cartItemId, updateData, userId) {
  try {
      const updatedCartItem = await knex('cart_items')
          .where({ product_id: cartItemId, user_id: userId })
          .update(updateData)

      return updatedCartItem[0];
  } catch (error) {
      throw new Error('Error updating cart item: ' + error.message);
  }
}
const insertToCart = async (userId, product) => {
  try {
    await knex('cart_items').insert({ user_id: userId, ...product });
  } catch (error) {
    throw error;
  }
}
const deleteFromCart = async (cartItemId, userId) => {
  try {
    console.log('Deleting cart item:', cartItemId, 'for user:', userId);
    const deletedCount = await knex('cart_items')
      .where({ product_id: cartItemId, user_id: userId })
      .del();
    console.log('Cart item deleted successfully');
  } catch (error) {
    console.error('Error deleting cart item:', error);
    throw error;
  }
};


const deleteAllFromCart = async (userId) => { 
  try {
    await knex('cart_items').where({ user_id: userId }).del();
  } catch (error) {
    throw error;
  }
}

const insertOrders = async (userId) => {
  try {
    const [orderId] = await knex('orders').insert({ user_id: userId });
    return orderId;
  } catch (error) {
    throw error;
  }
}

const deleteOrder = async (orderId) => {
  try {
    await knex('orders').where({ id: orderId }).del();
  } catch (error) {
    throw error;
  }
}

const insertToOrderItems = async (orderItems) => {
  try {
    await knex('order_items').insert(orderItems)
  } catch (error) {
    throw error;
  }
}

const getUserOrders = async (userId) => {
  try {
    const orders = await knex('orders')
    .join('order_items', 'orders.id', '=', 'order_items.order_id')
    .join('products', 'order_items.product_id', '=', 'products.id')
    .select('orders.id as order_id', 'products.name as product_name', 'order_items.quantity', 'orders.status', 'orders.created_at')
    .where('orders.user_id', userId);
    return orders;
  } catch (error) {
    throw error;
  }
}

const getAllOrders = async (orderStatusFilter, orderSort) => {
  let ordersQuery = knex('orders').select('*');

  if (orderStatusFilter) {
    ordersQuery = ordersQuery.where('status', orderStatusFilter);
  }

  if (orderSort) {
    ordersQuery = ordersQuery.orderBy(orderSort);
  }

  try {
    const orders = await ordersQuery;
    return orders;
  } catch (error) {
    throw error;
  }
}

const updateOrderStatus = async (orderId, status) => {
  try {
    const result = await knex('orders').where({ id: orderId }).update({ status });
    return result;
  } catch (error) {
    res.status(500).send(error.message);
  }
};


module.exports = { 
  saveUser, 
  deleteUser, 
  updateUser, 
  getAllUsers, 
  getUserById, 
  loginUser, 
  getProducts, 
  getProductsById, 
  updateProduct, 
  deleteProduct,
  getCartItems, 
  insertToCart, 
  deleteFromCart, 
  deleteAllFromCart,
  insertOrders,
  getAllOrders, 
  insertToOrderItems, 
  deleteOrder, 
  getUserOrders, 
  insertToProducts, 
  updateOrderStatus,
  updateCart
};
