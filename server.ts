import 'dotenv/config';
import logger from '@src/utils/logger';
import db from '@src/db';
import app from '@src/app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    logger.info(`App is running on ${PORT}`);
    await db.connect();
  } catch (err: any) {
    logger.error(err);
  }
});
