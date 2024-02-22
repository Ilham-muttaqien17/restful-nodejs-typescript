import 'dotenv/config';
import logger from '@src/utils/logger';
import cluster from 'node:cluster';
import os from 'os';
import { resolve } from 'path';

/**
 * Path resolver base on NODE_ENV
 * @param path - path file, ex: `/test`
 * @returns Resolved path, ex:
 */
export const pathResolver = (path: string) => {
  return resolve(
    __dirname.concat(process.env.NODE_ENV === 'development' ? path.concat('.ts') : path.concat('.js'))
  );
};

const cpuCount = Math.ceil(os.cpus().length / 2);

cluster.setupPrimary({
  exec: pathResolver('/server')
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}

cluster.on('exit', (worker) => {
  logger.info(`Worker ${worker.process.pid} has been killed`);
  logger.info('Starting another worker');
  cluster.fork();
});
