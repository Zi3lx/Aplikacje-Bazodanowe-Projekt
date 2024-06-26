const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const api = require('./api.js');
const mw = require('./middlewares');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Middleware do obsługi błędów
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});


// Add user data to locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Main page
app.get('/', async (req, res) => {
  try {
    const sortBy = req.query.sortBy;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const { products, totalPages, currentPage } = await api.getProducts(sortBy, page, limit);

    res.render('index', { products, totalPages, currentPage, sortBy, limit, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving products');
  }
});

// Register page
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', mw.validateUserData, async (req, res) => {
  const user = { first_name, last_name, email, password } = req.body;
  await api.saveUser({ first_name, last_name, email, password, role: 'customer' });;
  res.redirect('/login');
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await api.loginUser(email, password, res);
    if (user) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'An error occurred. Please try again.' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// View cart
app.get('/cart', mw.isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  try {
    const cartItems = await api.getCartItems(userId);
    res.render('cart', { cartItems });
  } catch (err) {
    res.status(500).send('Error retrieving cart items');
  }
});

// Add to cart
app.post('/cart', mw.isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const { product_id, quantity } = req.body;
  try {
    await api.insertToCart(userId, { product_id, quantity });
    res.redirect('/cart');
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).send('Error adding to cart');
  }
});

// POST method spoofing for PUT request
app.put('/cart/update', mw.isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const { cartItemId, quantity } = req.body;
  try {
    await api.updateCart(cartItemId, { quantity }, userId);
    res.redirect('/cart');
  } catch (err) {
    console.log('Error updating cart:', err);
    res.status(500).send('Error updating cart');
  }
});


// Remove from cart
app.delete('/cart/remove', mw.isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const { cartItemId } = req.body;
  console.log(cartItemId, userId);
  try {
    await api.deleteFromCart(cartItemId, userId);
    res.redirect('/cart');
  } catch (err) {
    console.log('Error removing from cart:', err);
    res.status(500).send('Error removing from cart');
  }
});

// Submit order
app.post('/orders', mw.isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;

  try {
    const cartItems = await api.getCartItems(userId);
    console.log(cartItems);

    if (cartItems.length === 0) {
      return res.redirect('/cart');
    }

    const orderId = await api.insertOrders(userId);
    console.log(orderId);

    const orderItems = cartItems.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity
    }));

    await api.insertToOrderItems(orderItems);
    await api.deleteAllFromCart(userId);

    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting order');
  }
});

// View orders
app.get('/orders', mw.isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  try {
    const orders = await api.getUserOrders(userId);
    res.render('orders', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
});

// Display form to add a new product
app.get('/products/new', mw.isAuthenticated, (req, res) => {
  res.render('add_products');
});

// Handle form submission to add a new product
app.post('/products', mw.isAuthenticated, async (req, res) => {
  const { name, price, description } = req.body;
  const userId = req.session.user.id;

  try {
    await api.insertToProducts([{ name, price, description, user_id: userId }], userId);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding product');
  }
});

// Handle form submission to update a product
app.put('/products/:id/edit', mw.isAuthenticated, async (req, res) => {
  const productId = req.params.id;
  const userId = req.session.user.id;
  const { name, price, description } = req.body;

  try {
    const product = await api.getProductsById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    const user = await api.getUserById(userId);

    if (product.user_id !== userId && user.role !== 'admin') {
      return res.status(403).send('You are not authorized to edit this product');
    }

    await api.updateProduct(productId, { name, price, description });

    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(500).send('Error updating product');
  }
});

// Display form to edit a product
app.get('/products/:id/edit', mw.isAuthenticated, async (req, res) => {
  const productId = req.params.id;
  const userId = req.session.user.id;

  try {
    const product = await api.getProductsById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    const user = await api.getUserById(userId);

    if (product.user_id !== userId && user.role !== 'admin') {
      return res.status(403).send('You are not authorized to edit this product');
    }

    res.render('edit_product', { product });
  } catch (err) {
    res.status(500).send('Error retrieving product');
  }
});

// Handle product deletion
app.delete('/products/:id/delete', mw.isAuthenticated, async (req, res) => {
  const productId = req.params.id;
  const userId = req.session.user.id;

  try {
    const product = await api.getProductsById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const user = await api.getUserById(userId);
    if (!user || (user.role !== 'admin' && user.id !== product.user_id)) {
      return res.status(403).send('You are not authorized to delete this product');
    }

    await api.deleteProduct(productId);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting product');
  }
});


// View admin page
app.get('/admin', mw.isAdmin, async (req, res) => {
  const userRoleFilter = req.query.userRoleFilter || '';
  const userSort = req.query.userSort || '';
  const orderStatusFilter = req.query.orderStatusFilter || '';
  const orderSort = req.query.orderSort || '';

  try {
    const users = await api.getAllUsers(userRoleFilter, userSort);
    const orders = await api.getAllOrders(orderStatusFilter, orderSort);
    res.render('admin', { users, orders, userRoleFilter, userSort, orderStatusFilter, orderSort });
  } catch (err) {
    res.status(500).send('Error retrieving data');
  }
});

// Add a new user
app.post('/admin/users', mw.isAdmin, async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  try {
    await api.saveUser({ first_name, last_name, email, password, role });
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error adding user');
  }
});

// Delete user
app.delete('/admin/users/:id', mw.isAdmin, async (req, res) => {
  const userId = req.params.id;
  try {
    await api.deleteUser(userId);
    res.redirect('/admin');
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Error deleting user');
  }
});

// Edit user
app.put('/admin/users/:id', mw.isAdmin, async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, email, role } = req.body;
  try {
    await api.updateUser(userId, { first_name, last_name, email, role });
    res.redirect('/admin');
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Error updating user');
  }
});

// Edit order
app.put('/admin/orders/:id', mw.isAdmin, async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  try {
    await api.updateOrderStatus(orderId, status);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating order');
  }
});

// Delete order
app.delete('/admin/orders/:id', mw.isAdmin, async (req, res) => {
  const orderId = req.params.id;
  try {
    await api.deleteOrder(orderId);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error deleting order');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${HOST} ${PORT}`);
});
