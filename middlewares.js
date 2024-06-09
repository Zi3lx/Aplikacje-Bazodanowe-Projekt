const knex = require('knex')(require('./knexfile').development);

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

module.exports = { isAuthenticated, isAdmin }