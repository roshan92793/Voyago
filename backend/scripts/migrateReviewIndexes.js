require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('../models/review');

const migrate = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required in backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    await Review.collection.dropIndex('user_1_destination_1');
    console.log('Removed the legacy review index.');
  } catch (error) {
    if (error.codeName !== 'IndexNotFound') throw error;
    console.log('Legacy review index was not present.');
  }

  await Review.syncIndexes();
  console.log('Review indexes migrated successfully.');
  await mongoose.disconnect();
};

migrate().catch(async (error) => {
  console.error('Review-index migration failed:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
