import { NextFunction, Request, Response } from 'express';
import HttpResponse from '@src/utils/response';
import logger from '@src/utils/logger';
import ResponseError from '@src/error/response_error';
import Session from '@src/models/session.model';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      throw new ResponseError(401, 'Unauthorized');
    }

    const [tokenType, tokenValue] = req.headers.authorization.split(' ');

    if (tokenType !== 'Bearer') {
      throw new ResponseError(401, 'Unauthorized');
    }

    jwt.verify(tokenValue, process.env.JWT_SECRET);

    const session = await Session.findOne({
      where: {
        token: tokenValue
      }
    });

    if (!session) {
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
