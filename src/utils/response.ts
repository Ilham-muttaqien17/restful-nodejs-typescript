import { Response } from 'express';
import { ValidationError } from 'sequelize';
import ResponseError from '@src/error/response_error';
import { Nullable } from '@src/types';
import { ucFirst } from '@src/utils/helpers';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

interface SuccessResponse {
  statusCode: number;
  data?: Nullable<Record<string, any> | Record<string, any>[]>;
  message?: string;
  pagination?: Record<string, any>;
}

const HttpResponse = {
  success: (res: Response, { statusCode, message, data, pagination }: SuccessResponse) => {
    return res.status(statusCode).send({
      message: message,
      data: data,
      pagination: pagination
    });
  },
  error: (res: Response, err: any) => {
    if (err instanceof ValidationError) {
      return res.status(422).send({
        message: ucFirst(err.errors[0].message)
      });
    }

    if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError) {
      return res.status(401).send({
        message: 'Token is not valid'
      });
    }

    if (err instanceof ResponseError) {
      return res.status(err.statusCode).send({
        message: err.message,
        errors: err.errors
      });
    }

    return res.status(err.statusCode).send({
      message: err.message
    });
  }
};

export default HttpResponse;
