import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import HttpResponse from '../utils/response';
import logger from '../utils/logger';
import ResponseError from '../error/response_error';
import Session from '../models/session.model';
import { dateFormatter } from '../utils/dayjs';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw new ResponseError(401, 'Unauthorized');
    }

    if (req.headers.authorization.split(' ')[0] !== 'Bearer') {
      throw new ResponseError(401, 'Unauthorized');
    }

    const token = String(req.headers.authorization.split(' ')[1] ?? '');
    const session = await Session.findOne({
      where: {
        token: token,
      },
    });

    if (
      !session ||
      dateFormatter().isAfter(dateFormatter.unix(session.expiredAt))
    ) {
      throw new ResponseError(401, 'Unauthorized');
    }

    res.locals.session = session;
    next();
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

export default authMiddleware;
