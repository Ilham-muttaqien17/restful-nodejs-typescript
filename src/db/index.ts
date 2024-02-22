import { Sequelize, Options, Dialect } from 'sequelize';
import mysql from 'mysql2/promise';
import { Client } from 'pg';
import logger from '@src/utils/logger';

const env = process.env.NODE_ENV || 'development';

export const DB_CONFIG: Record<string, Options> = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(String(process.env.DB_PORT), 10) || 5432,
    password: process.env.DB_PASSWORD || '',
    username: process.env.DB_USERNAME || 'postgres',
    database: process.env.DB_NAME || 'restful_typescript_development',
    dialect: (process.env.DB_DRIVER as Dialect) || 'postgres',
    logging: false
  },
  test: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(String(process.env.DB_PORT), 10) || 5432,
    password: process.env.DB_PASSWORD || '',
    username: process.env.DB_USERNAME || 'postgres',
    database: process.env.DB_NAME || 'restful_typescript_test',
    dialect: (process.env.DB_DRIVER as Dialect) || 'postgres',
    logging: false
  },
  production: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(String(process.env.DB_PORT), 10) || 5432,
    password: process.env.DB_PASSWORD || '',
    username: process.env.DB_USERNAME || 'postgres',
    database: process.env.DB_NAME || 'restful_typescript_production',
    dialect: (process.env.DB_DRIVER as Dialect) || 'postgres',
    logging: false
  }
};

type SupportedDialect = Extract<Dialect, 'mysql' | 'postgres'>;
const { host, port, username, password, database } = DB_CONFIG[env];

const connection: Record<SupportedDialect, () => Promise<void>> = {
  mysql: async () => {
    const connection = await mysql.createConnection({ host, port, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  },
  postgres: async () => {
    const pg = new Client({ host, port, user: username, password });
    await pg.connect();
    const row = await pg.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname='${database}'`);
    if (row.rowCount === 0) {
      await pg.query(`CREATE DATABASE ${database}`);
    }
  }
};

const sequelize = new Sequelize(DB_CONFIG[env]);

const connect = async () => {
  await connection[DB_CONFIG[env].dialect as SupportedDialect]();
  await sequelize.authenticate();
  logger.info('Database connected successfully!');

  await sequelize.sync({ alter: false }); // set option with alter to `true` for updating model column
  logger.info('Database syncronized successfully!');
};

export default {
  sequelize,
  connect
};
