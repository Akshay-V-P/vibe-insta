require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const hbs = require('hbs');

const app = express();

// connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vibe-insta';
console.log('Using MongoDB URI:', mongoUri);
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// register Handlebars helpers
hbs.registerHelper('formatDate', function(date) {
  if (!date) return '';
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000); // seconds
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h';
  if (diff < 7 * 86400) return Math.floor(diff / 86400) + 'd';
  // else show short date like 'Mar 2'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
});

// static
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoUri })
}));

// basic routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// handle server errors (EADDRINUSE etc.)
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please free the port or set a different PORT environment variable.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
