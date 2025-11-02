const Post = require('../models/Post');

exports.list = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 }).limit(20);
  res.render('posts/list', { posts });
};

exports.create = async (req, res) => {
  // multer would populate req.file
  const { caption } = req.body;
  const post = new Post({ caption, image: req.file ? req.file.path : undefined, author: req.session.userId });
  await post.save();
  res.redirect('/posts');
};
