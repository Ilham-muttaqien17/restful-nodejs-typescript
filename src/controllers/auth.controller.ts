import { Request, Response, NextFunction } from 'express';
import {
  createUser,
  createSession,
  destroySession,
  currentUser,
} from '../services/user.service';
import logger from '../utils/logger';
import HttpResponse from '../utils/response';

const register = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req);
    HttpResponse.success(res, {
      statusCode: 201,
      data: user,
    });
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = await createSession(req);
    HttpResponse.success(res, {
      statusCode: 200,
      data: result,
    });
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    await destroySession(res);
    HttpResponse.success(res, {
      statusCode: 200,
      message: 'Logout success',
    });
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

const current = async (req: Request, res: Response) => {
  try {
    const result = await currentUser(res);
    HttpResponse.success(res, {
      statusCode: 200,
      data: result,
    });
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

export default { register, login, logout, current };
