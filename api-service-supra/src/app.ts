// Update src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import { config } from './config';
import routes from './routes';

const app = express();

mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api', routes);

export default app;