import { Request, Response, NextFunction } from 'express';
import sanitize from '@src/utils/sanitizer';

const target = ['body', 'params', 'headers', 'query'] as const;

const sanitizerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  target.forEach((key) => {
    if (req[key]) {
      req[key] = sanitize(req[key]);
    }
  });
  next();
};

export default sanitizerMiddleware;
