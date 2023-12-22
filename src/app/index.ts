import 'dotenv/config';
import express from 'express';
import publicRoutes from '@src/routes/public';
import privateRoutes from '@src/routes/private';
import limiter from '@src/middlewares/rate-limiter';

const app = express();

app.use(express.json());
app.use(limiter);

// Public route
app.use('/api', publicRoutes);

// Need auth
app.use('/api', privateRoutes);

export default app;
