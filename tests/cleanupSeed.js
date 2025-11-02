require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Post = require('../models/Post');

async function cleanup() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vibe-insta';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', mongoUri);

  // Remove posts with caption starting with [SEED]
  const postResult = await Post.deleteMany({ caption: { $regex: '^\\[SEED\\]' } });
  console.log('Removed posts:', postResult.deletedCount);

  // Remove seed users (emails ending with @seed.local)
  const userResult = await User.deleteMany({ email: { $regex: '@seed\\.local$' } });
  console.log('Removed users:', userResult.deletedCount);

  await mongoose.disconnect();
}

cleanup().catch(err => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
