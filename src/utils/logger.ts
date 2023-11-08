import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {}
  }
});

export default logger;
