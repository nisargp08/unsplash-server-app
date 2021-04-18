import { access, constants, mkdir } from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

require('dotenv').config();

// Multer storage config
export const uploadDirectory = path.resolve(__dirname, '..', '..', 'public/uploads');
export const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    access(uploadDirectory, constants.F_OK, (err) => {
      // If error = Directory does not exists
      if (err) {
        // Create a directory
        mkdir(uploadDirectory, { recursive: true }, (error) => {
          cb(error, uploadDirectory);
        });
      } else {
        cb(null, uploadDirectory);
      }
    });
  },
  filename: (req, file, cb) => {
    const fileType = file.mimetype.split('/')[1];
    const fileName = `${uuidv4()}.${fileType}`;
    cb(null, fileName);
  },
});
// Init upload
export const upload = multer({
  storage,
}).single('mediaUpload');

// Mongodb config
// Since we need to use different db url for dev and production
// Set them up according to current environment
let dbUrl;
if (process.env.NODE_ENV === 'production') {
  dbUrl = process.env.PROD_DB_URL;
} else {
  dbUrl = process.env.DEV_DB_URL;
}
// Connect to mongodb database
export const connectToDB = (url = dbUrl, opts = {}) => mongoose.connect(url, {
  ...opts,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Api status codes
export const code = {
  ok: 200,
  created: 201,
  badRequest: 400,
  notFound: 404,
};
