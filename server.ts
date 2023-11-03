import 'dotenv/config';
import express from 'express';
import logger from './src/utils/logger';
import publicRoutes from './src/routes/public';
import privateRoutes from './src/routes/private';
import db from './src/db';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

// Public route
app.use('/api', publicRoutes);

// Need auth
app.use('/api', privateRoutes);

app.listen(PORT, async () => {
  try {
    logger.info(`App is running on ${PORT}`);
    await db.connect();
  } catch (err: any) {
    logger.error(err);
  }
});
