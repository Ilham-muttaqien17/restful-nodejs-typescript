import 'dotenv/config';
import express from 'express';
import publicRoutes from '@src/routes/public';
import privateRoutes from '@src/routes/private';

const app = express();

app.use(express.json());

// Public route
app.use('/api', publicRoutes);

// Need auth
app.use('/api', privateRoutes);

export default app;
