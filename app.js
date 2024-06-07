//TODO:
// fix updating products

const express = require('express');
const path = require('path');
const knex = require('knex')(require('./knexfile').development);
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Add this line to parse JSON bodies
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Middleware to set the user in response locals if logged in
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Rejestracja
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  await knex('users').insert({ first_name, last_name, email, password, role: 'customer' });
  res.redirect('/login');
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Access denied. Admins only.');
};

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await knex('users').where({ email, password }).first();
    if (user) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid email or password' });
    }
  } catch (err) {
    res.render('login', { error: 'An error occurred. Please try again.' });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Home page
app.get('/', async (req, res) => {
  try {
    const products = await knex('products').select('*');
    res.render('index', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving products');
  }
});

// View cart
app.get('/cart', isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  try {
    const cartItems = await knex('cart_items')
      .join('products', 'cart_items.product_id', 'products.id')
      .where('cart_items.user_id', userId)
      .select('cart_items.id', 'products.name', 'products.price', 'cart_items.quantity');
    res.render('cart', { cartItems });
  } catch (err) {
    res.status(500).send('Error retrieving cart items');
  }
});

// Add to cart
app.post('/cart', isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const { product_id, quantity } = req.body;
  try {
    await knex('cart_items').insert({ user_id: userId, product_id, quantity });
    res.redirect('/cart');
  } catch (err) {
    console.error('Error adding to cart:', err); // Log the error for debugging
    res.status(500).send('Error adding to cart');
  }
});

// Remove from cart
app.delete('/cart', isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const { cartItemId } = req.body;
  try {
    await knex('cart_items').where({ id: cartItemId, user_id: userId }).del();
    res.redirect('/cart');
  } catch (err) {
    res.status(500).send('Error removing from cart');
  }
});

// Submit order
app.post('/orders', isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;

  try {
    // Fetch cart items for the user
    const cartItems = await knex('cart_items').where({ user_id: userId });

    if (cartItems.length === 0) {
      return res.redirect('/cart');
    }

    // Create a new order
    const [orderId] = await knex('orders').insert({ user_id: userId });

    // Move items from cart to order_items
    const orderItems = cartItems.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity
    }));

    await knex('order_items').insert(orderItems);

    // Clear the cart
    await knex('cart_items').where({ user_id: userId }).del();

    res.redirect('/orders');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting order');
  }
});

// View orders
app.get('/orders', isAuthenticated, async (req, res) => {
  try {
    // Get the user's orders with product details
    const orders = await knex('orders')
      .join('order_items', 'orders.id', '=', 'order_items.order_id')
      .join('products', 'order_items.product_id', '=', 'products.id')
      .select('orders.id as order_id', 'products.name as product_name', 'order_items.quantity', 'orders.status', 'orders.created_at')
      .where('orders.user_id', req.session.user.id);

    // Render the orders view
    res.render('orders', { orders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
});

// Display form to add a new product
app.get('/products/new', isAuthenticated, (req, res) => {
  res.render('add_products');
});

// Handle form submission to add a new product
app.post('/products', isAuthenticated, async (req, res) => {
  const { name, price, description } = req.body;
  const userId = req.session.user.id;

  try {
    await knex('products').insert({ name, price, description, user_id: userId });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding product');
  }
});

// Handle form submission to update a product
app.put('/products/:id/edit', isAuthenticated, async (req, res) => {
  const productId = req.params.id;
  const userId = req.session.user.id;
  const { name, price, description } = req.body;

  try {
    const product = await knex('products').where({ id: productId }).first();

    if (!product) {
      return res.status(404).send('Product not found');
    }

    const user = await knex('users').where({ id: userId }).first();

    if (product.user_id !== userId && user.role !== 'admin') {
      return res.status(403).send('You are not authorized to edit this product');
    }

    await knex('products').where({ id: productId }).update({ name, price, description });

    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error updating product');
  }
});

// Display form to edit a product
app.get('/products/:id/edit', isAuthenticated, async (req, res) => {
  const productId = req.params.id;
  const userId = req.session.user.id;

  try {
    const product = await knex('products').where({ id: productId }).first();

    if (!product) {
      return res.status(404).send('Product not found');
    }

    const user = await knex('users').where({ id: userId }).first();

    if (product.user_id !== userId && user.role !== 'admin') {
      return res.status(403).send('You are not authorized to edit this product');
    }

    res.render('edit_product', { product });
  } catch (err) {
    res.status(500).send('Error retrieving product');
  }
});

// Handle product deletion
app.delete('/products/:id/delete', isAuthenticated, async (req, res) => {
    const productId = req.params.id;
    const userId = req.session.user.id;

    try {
        // Check if the product exists
        const product = await knex('products').where({ id: productId }).first();
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Check if the user is authorized to delete the product
        const user = await knex('users').where({ id: userId }).first();
        if (!user || (user.role !== 'admin' && user.id !== product.user_id)) {
            return res.status(403).send('You are not authorized to delete this product');
        }

        // Delete the product
        await knex('products').where({ id: productId }).del();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product');
    }
});


// View admin page
app.get('/admin', isAdmin, async (req, res) => {
  const userRoleFilter = req.query.userRoleFilter || '';
  const userSort = req.query.userSort || '';
  const orderStatusFilter = req.query.orderStatusFilter || '';
  const orderSort = req.query.orderSort || '';

  let usersQuery = knex('users').select('*');
  let ordersQuery = knex('orders').select('*');

  if (userRoleFilter) {
    usersQuery = usersQuery.where('role', userRoleFilter);
  }

  if (userSort) {
    usersQuery = usersQuery.orderBy(userSort);
  }

  if (orderStatusFilter) {
    ordersQuery = ordersQuery.where('status', orderStatusFilter);
  }

  if (orderSort) {
    ordersQuery = ordersQuery.orderBy(orderSort);
  }

  try {
    const users = await usersQuery;
    const orders = await ordersQuery;
    res.render('admin', { users, orders, userRoleFilter, userSort, orderStatusFilter, orderSort });
  } catch (err) {
    res.status(500).send('Error retrieving data');
  }
});

// Add a new user
app.post('/admin/users', isAdmin, async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  try {
    await knex('users').insert({ first_name, last_name, email, password, role });
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error adding user');
  }
});

// Delete user
app.delete('/admin/users/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    try {
      await knex('users').where({ id: userId }).del();
      res.redirect('/admin');
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Error deleting user');
    }
});   
  
// Edit user
app.put('/admin/users/:id', isAdmin, async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email, role } = req.body;
    try {
        await knex('users').where({ id: userId }).update({ first_name, last_name, email, role });
        res.redirect('/admin');
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
    }
});

// Edit order
app.put('/admin/orders/:id', isAdmin, async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    try {
        await knex('orders').where({ id: orderId }).update({ status });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating order');
    }
});

// Delete order
app.delete('/admin/orders/:id', isAdmin, async (req, res) => {
  const orderId = req.params.id;
  try {
    await knex('orders').where({ id: orderId }).del();
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Error deleting order');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
