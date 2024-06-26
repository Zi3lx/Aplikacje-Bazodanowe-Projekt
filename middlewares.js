const knex = require('knex')(require('./knexfile').development);

const validateUserData = async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).send('All fields are required.');
  }

  if (first_name.includes(' ') || last_name.includes(' ')) {
    return res.status(400).send('Name or last name cannot contain spaces.');
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).send('Enter a valid email.');
  }

  if (password.length < 6) {
    return res.status(400).send('Password must be at least 6 characters long.');
  }

  // Check if the email already exists
  const existingUser = await knex('users').where({ email }).first();
  if (existingUser) {
    return res.status(400).send('Email is already in use.');
  }

  next();
};

const validateProductData = async (req, res, next) => {
  const { name, price, description } = req.body;
  if (!name || !description || !price) {
    return res.status(400).send('All fields are required.');
  }
  if (name.includes(' ') || description.includes(' ')) {
    return res.status(400).send('Name or description cannot contain spaces.');
  }
  if (price < 0) {
    return res.status(400).send('Price cannot be negative.');
  }
  next();
};

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

module.exports = { isAuthenticated, isAdmin, validateUserData, validateProductData }