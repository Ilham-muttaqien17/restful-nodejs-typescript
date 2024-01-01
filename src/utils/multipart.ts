import multer from 'multer';
import fs from 'fs';
import ResponseError from '@src/error/response_error';
import { MIME_TYPE, Nullable } from '@src/types';

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    if (!fs.existsSync('uploads/')) {
      fs.mkdirSync('uploads/');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

/**
 * Validate uploaded file
 * @param file - Express request file
 * @param mimes - Allowed file mimetype's
 * @param maxSize - Maximum file size supported
 * @returns Validated file
 */
export const validateUploadedFile = (
  file: Express.Multer.File,
  mimes: MIME_TYPE[],
  maxSize: number = 1000000
): Nullable<Express.Multer.File> => {
  if (!file) return null;
  if (!mimes.includes(file.mimetype as MIME_TYPE)) {
    throw new ResponseError(400, 'File format is not supported');
  }

  if (file.size > maxSize) {
    throw new ResponseError(400, 'File size is too large');
  }
  return file;
};

export const uploader = multer({ storage });
