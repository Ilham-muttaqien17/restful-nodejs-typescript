import { NextFunction, Request, Response } from 'express';
import HttpResponse from '@src/utils/response';
import logger from '@src/utils/logger';
import ResponseError from '@src/error/response_error';
import Session from '@src/models/session.model';
import { dateFormatter } from '@src/utils/dayjs';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
        token: token
      }
    });

    if (!session || dateFormatter().isAfter(dateFormatter.unix(session.expiredAt))) {
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
