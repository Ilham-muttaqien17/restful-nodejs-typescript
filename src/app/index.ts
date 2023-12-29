import 'dotenv/config';
import express from 'express';
import publicRoutes from '@src/routes/public';
import privateRoutes from '@src/routes/private';
import limiter from '@src/middlewares/rate-limiter';
import helmet from 'helmet';
import sanitizer from '@src/middlewares/sanitizer';

const app = express();

// Parse request body to json
app.use(express.json());
// Rate limiter for each request based on ip address
app.use(limiter);
// Secure Express by set HTTP response headers
app.use(helmet());
// Sanitize request data
app.use(sanitizer);

// Public route
app.use('/api', publicRoutes);

// Need auth
app.use('/api', privateRoutes);

app.use('*', (req, res) => {
  res.status(404).send({
    status: 404,
    message: 'Resouce not found'
  });
});

export default app;
