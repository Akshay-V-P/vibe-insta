require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Post = require('../models/Post');

async function seed() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vibe-insta';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', mongoUri);

  // Create or find seed users
  const usersData = [
    { username: 'alice', email: 'alice@seed.local', password: bcrypt.hashSync('password123', 10) },
    { username: 'bob', email: 'bob@seed.local', password: bcrypt.hashSync('password123', 10) }
  ];

  const users = [];
  for (const u of usersData) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      user = new User(u);
      await user.save();
      console.log('Created user', user.email);
    } else {
      console.log('Found existing user', user.email);
    }
    users.push(user);
  }

  // Seed posts
  const postsData = [
    { author: users[0]._id, image: 'uploads/seed1.jpg', caption: '[SEED] Sunrise vibes' },
    { author: users[1]._id, image: 'uploads/seed2.jpg', caption: '[SEED] Coffee and code' },
    { author: users[0]._id, image: 'uploads/seed3.jpg', caption: '[SEED] Weekend hike' }
  ];

  const created = [];
  for (const p of postsData) {
    const post = new Post(p);
    await post.save();
    created.push(post);
    console.log('Created post:', post.caption);
  }

  console.log(`Seeding complete. Created ${created.length} posts.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
