const knex = require('knex')(require('./knexfile').development);

const saveUser = async (user) => {
  try {
    await knex('users').insert({ ...user });
  } catch (error) {
    throw new Error('Error saving user: ' + error.message);
  }
};

const deleteUser = async (userId) => {
  try {
    await knex('users').where({ id: userId }).del();
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
}

const updateUser = async (userId, user) => {
  try {
    await knex('users').where({ id: userId }).update({ ...user });
  } catch (error) {
    throw new Error('Error updating user: ' + error.message);
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
    throw new Error('Error retrieving users: ' + error.message);
  }
}

const getUserById = async (userId) => {
  try {
    const user = await knex('users').where({ id: userId }).first();
    return user;
  } catch (error) {
    throw new Error('Error retrieving user: ' + error.message);
  }
}

const loginUser = async (email, password) => {
  try {
    const user = await knex('users').where({ email, password }).first();
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return user;
  } catch (error) {
    throw new Error('Error logging in: ' + error.message);
  }
}

const insertToProducts = async (products, userId) => {
  try {
    await knex('products').insert(...products, { user_id: userId });
  } catch (error) {
    throw new Error('Error inserting products: ' + error.message);
  }
}

const getProducts = async (sortBy, page = 1, limit) => {
  let query = knex('products');

  if (sortBy === 'name') {
    query = query.orderBy('name');
  } else if (sortBy === 'price') {
    query = query.orderBy('price');
  }

  const offset = (page - 1) * limit;

  try {
    const products = await query.offset(offset).limit(limit).select('*');
    const totalCount = await knex('products').count('* as count').first();
    const totalPages = Math.ceil(totalCount.count / limit);

    return { products, totalPages, currentPage: page };
  } catch (error) {
    throw new Error('Error retrieving products: ' + error.message);
  }
};

const deleteProduct = async (productId) => {
  try {
    await knex('products').where({ id: productId }).del();
  } catch (error) {
    throw new Error('Error deleting product: ' + error.message);
  }
}

const getProductsById = async (productId) => {
  try {
    const product = await knex('products').where({ id: productId }).first();
    return product;
  } catch (error) {
    throw new Error('Error retrieving product: ' + error.message);
  }
}

const updateProduct = async (productId, product) => {
  try {
    await knex('products').where({ id: productId }).update(product);
  } catch (error) {
    throw new Error('Error updating product: ' + error.message);
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
    throw new Error('Error retrieving cart items: ' + error.message);
  }
}

const updateCart = async (cartItemId, updateData, userId) => {
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
    throw new Error('Error inserting to cart: ' + error.message);
  }
}

const deleteFromCart = async (cartItemId, userId) => {
  try {
    const deletedCount = await knex('cart_items')
      .where({ product_id: cartItemId, user_id: userId })
      .del();
    if (deletedCount === 0) {
      throw new Error('Cart item not found');
    }
  } catch (error) {
    throw new Error('Error deleting from cart: ' + error.message);
  }
}

const deleteAllFromCart = async (userId) => {
  try {
    await knex('cart_items').where({ user_id: userId }).del();
  } catch (error) {
    throw new Error('Error deleting all items from cart: ' + error.message);
  }
}

const insertOrders = async (userId) => {
  try {
    const [orderId] = await knex('orders').insert({ user_id: userId });
    return orderId;
  } catch (error) {
    throw new Error('Error inserting order: ' + error.message);
  }
}

const deleteOrder = async (orderId) => {
  try {
    await knex('orders').where({ id: orderId }).del();
  } catch (error) {
    throw new Error('Error deleting order: ' + error.message);
  }
}

const insertToOrderItems = async (orderItems) => {
  try {
    await knex('order_items').insert(orderItems)
  } catch (error) {
    throw new Error('Error inserting order items: ' + error.message);
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
    throw new Error('Error retrieving user orders: ' + error.message);
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
    throw new Error('Error retrieving orders: ' + error.message);
  }
}

const updateOrderStatus = async (orderId, status) => {
  try {
    const result = await knex('orders').where({ id: orderId }).update({ status });
    return result;
  } catch (error) {
    throw new Error('Error updating order status: ' + error.message);
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
