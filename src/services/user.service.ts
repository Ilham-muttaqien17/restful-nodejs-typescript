import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { type UserAttributes } from '@src/models/user.model';
import ResponseError from '@src/error/response_error';
import { validator } from '@src/utils/validator';
import Session from '@src/models/session.model';
import { buildPaginationParams } from '@src/utils/pagination';
import { toArray } from '@src/utils/helpers';
import { validateUploadedFile } from '@src/utils/multipart';

const PASSWORD_REGEX = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const USER_ATTRIBUTES = ['id', 'email', 'name', 'description', 'profileImg', 'createdAt', 'updatedAt'];

/**
 * Create new user
 * @param req - Axios Request
 * @returns Object of created user
 */
const createUser = async (req: Request) => {
  const validations: Record<keyof Omit<UserAttributes, 'profileImg'>, any> = {
    name: z.string(),
    email: z.string().refine((val) => EMAIL_REGEX.test(val), {
      message: 'Is not valid format'
    }),
    password: z
      .string()
      .min(8)
      .refine((val) => PASSWORD_REGEX.test(val), {
        message: 'At least contain lower char, upper char & number'
      }),
    description: z.string().optional()
  };

  const parsedBody = validator<UserAttributes>({
    data: req.body,
    schema: z.object(validations)
  });

  const existingUser = await User.findOne({
    where: {
      email: parsedBody?.email
    }
  });

  if (existingUser) {
    throw new ResponseError(400, 'Email already registered');
  }

  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(parsedBody?.password as string, saltRounds);

  return await User.create<Model<Omit<UserAttributes, 'profileImg'>>>({
    name: parsedBody?.name as string,
    email: parsedBody?.email as string,
    password: hashedPassword,
    description: parsedBody?.description as string
  });
};

/**
 * Create user session
 * @param req - Axios Request
 * @returns Object contains user data and access token
 */
const createSession = async (req: Request) => {
  const validations = {
    email: z.string().min(1, 'Is required'),
    password: z.string().min(1, 'Is required')
  };

  const parsedBody = validator<UserAttributes>({
    data: req.body,
    schema: z.object(validations)
  });

  const user = await User.findOne({
    where: {
      email: parsedBody?.email
    }
  });

  if (!user) {
    throw new ResponseError(400, 'Email or password is not valid');
  }

  const isValidCredentials = bcrypt.compareSync(parsedBody?.password as string, user.password);

  if (!isValidCredentials) {
    throw new ResponseError(400, 'Email or password is not valid');
  }

  const maxAge = 60000 * 15; // 15 minutes in milliseconds

  const token = jwt.sign({ data: user }, process.env.JWT_SECRET, {
    expiresIn: maxAge / 1000
  });

  await user.addSession(
    await Session.create({
      token: token
    })
  );

  const data = {
    id: user.id,
    name: user.name,
    email: user.email,
    token: {
      type: 'Bearer',
      value: token,
      maxAge
    }
  };

  return data;
};

/**
 * Destroy user session
 * @param res - Axios Response
 */
const destroySession = async (res: Response) => {
  await res.locals.session.destroy();
};

/**
 * Get current logged in user
 * @param res - Axios Response
 * @returns current user
 */
const currentUser = async (res: Response) => {
  const user = await User.findOne({
    where: {
      id: res.locals.session.userId
    },
    attributes: USER_ATTRIBUTES
  });
  return user;
};

/**
 * Update current user data
 * @param req - Axios Request
 * @param res - Axios Response
 * @returns Updated current user data
 */
const updateCurrentUser = async (req: Request, res: Response) => {
  const reqFile = toArray<Express.Multer.File>(req.files).find(
    (v) => v.fieldname === 'profile-img'
  ) as Express.Multer.File;
  const validatedFile = validateUploadedFile(reqFile, ['image/jpeg', 'image/png']);

  const validations: Record<keyof Pick<UserAttributes, 'name' | 'description'>, any> = {
    name: z.string().min(1, 'Is required').optional(),
    description: z.string().optional()
  };

  const parsedBody = validator<UserAttributes>({
    data: req.body,
    schema: z.object(validations)
  });

  const user = await User.findOne({
    where: {
      id: res.locals.session.userId
    }
  });

  if (!user) {
    throw new ResponseError(404, 'User is not found!');
  }

  return await user.update({
    name: parsedBody?.name,
    description: parsedBody?.description,
    profileImg: validatedFile ? '/public/'.concat(validatedFile?.filename) : ''
  });
};

/**
 * Get all user
 * @returns Promise<User[]>
 */
const getAllUser = async (req: Request) => {
  const { page, limit, offset, col, direction } = buildPaginationParams(req);

  const users = await User.findAndCountAll({
    attributes: USER_ATTRIBUTES,
    limit,
    offset,
    order: [[col, direction]]
    // include: {
    //   as: 'sessions',
    //   model: Session
    // },
  });

  const data = {
    rows: users.rows,
    total: users.count,
    page,
    limit
  };

  return data;
};

/**
 * Get user detail
 * @param id - user_id
 * @returns Promise<User>
 */
const getDetailUser = async (id: string) => {
  const user = await User.findOne({
    where: {
      id: id
    },
    attributes: USER_ATTRIBUTES
  });

  return user;
};

const updateUser = async (req: Request, id: number) => {
  const validations = {
    name: z.string().min(1, 'Is required').optional()
  };

  const parsedBody = validator<UserAttributes>({
    data: req.body,
    schema: z.object(validations)
  });

  const user = await User.findOne({
    where: {
      id: id
    }
  });

  if (!user) {
    throw new ResponseError(404, 'User is not found!');
  }

  return await user.update({
    name: parsedBody?.name
  });
};

/**
 * Delete user
 * @param id - user_id
 */
const deleteUser = async (id: string) => {
  const user = await User.findOne({
    where: {
      id: id
    }
  });

  if (!user) {
    throw new ResponseError(404, 'User is not found!');
  }

  await User.destroy({
    where: {
      id: id
    }
  });
};

export {
  createUser,
  createSession,
  getAllUser,
  getDetailUser,
  deleteUser,
  updateUser,
  destroySession,
  currentUser,
  updateCurrentUser
};
