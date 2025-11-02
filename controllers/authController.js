const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.showRegister = (req, res) => res.render('auth/register');
exports.showLogin = (req, res) => res.render('auth/login');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashed });
  await user.save();
  req.session.userId = user._id;
  res.redirect('/');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.render('auth/login', { error: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render('auth/login', { error: 'Invalid credentials' });
  req.session.userId = user._id;
  res.redirect('/');
};
