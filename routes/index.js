const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// GET homepage - show latest posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50).populate('author', 'username avatar');
    res.render('home', { title: 'Vibe Insta', posts });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
