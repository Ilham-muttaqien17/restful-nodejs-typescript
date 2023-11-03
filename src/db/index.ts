import { Sequelize, Options, Dialect } from 'sequelize';
import logger from '@src/utils/logger';

const DB_CONFIG: Options = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(String(process.env.DB_PORT), 10) || 5432,
  password: process.env.DB_PASSWORD || '',
  username: process.env.DB_USERNAME || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  dialect: (process.env.DB_DRIVER as Dialect) || 'postgres',
  logging: false,
};

const sequelize = new Sequelize(DB_CONFIG);

const connect = async () => {
  await sequelize.authenticate();
  logger.info('Database connected successfully!');

  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync();
    logger.info('Database syncronized successfully!');
  }
};

export default {
  sequelize,
  connect,
};
