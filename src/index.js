import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { connectToDB, uploadDirectory } from './config/app';
// Route imports
import PhotoRouter from './resources/photo/photo.router';

// Initialize express app
const app = express();

// To disable 'x-powered-by' property in our response
app.disable('x-powered-by');

// Middlewares
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(uploadDirectory));
app.use(morgan('dev'));

// Routes
app.use('/api/fileUpload', PhotoRouter);

app.listen(5555, async () => {
  try {
    await connectToDB();
    console.log('Server is live and listening on : 5555');
  } catch (error) {
    console.error('Error connecting to database');
  }
});
