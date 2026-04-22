import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedDatabase } from './seedData.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/utkal_reserve';

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  const result = await seedDatabase({ force: true });
  console.log(result.skipped ? 'Seed skipped.' : 'Database seeded for Utkal Reserve.');
  await mongoose.disconnect();
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exit(1);
}
