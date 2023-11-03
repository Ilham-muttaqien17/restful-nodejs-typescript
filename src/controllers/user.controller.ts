import { Request, Response, NextFunction } from 'express';
import {
  deleteUser,
  getAllUser,
  getDetailUser,
  updateUser,
} from '@src/services/user.service';
import logger from '@src/utils/logger';
import ResponseError from '@src/error/response_error';
import HttpResponse from '@src/utils/response';

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUser();
    HttpResponse.success(res, {
      statusCode: 200,
      data: users,
    });
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

const detail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getDetailUser(req.params?.id);
    if (!user) {
      throw new ResponseError(404, 'User not found');
    }
    HttpResponse.success(res, {
      statusCode: 200,
      data: user,
    });
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const result = await updateUser(req, userId);
    HttpResponse.success(res, {
      statusCode: 200,
      message: 'User updated successfully',
      data: result,
    });
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUser(req.params?.id);
    HttpResponse.success(res, {
      statusCode: 200,
      message: 'User deleted successfully',
    });
  } catch (err: any) {
    logger.error(err);
    HttpResponse.error(res, err);
  }
};

export default { list, detail, update, destroy };
