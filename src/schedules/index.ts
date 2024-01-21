import cron from 'node-cron';
import db from '@src/db';
import logger from '@src/utils/logger';

const pingDatabase = () => {
  const schedule = cron.schedule('0 0 * * *', async () => {
    await db.sequelize.authenticate();
    logger.info('Ping Database');
  });

  schedule.start();
};

export { pingDatabase };
