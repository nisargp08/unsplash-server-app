import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { connectToDB, uploadDirectory } from './config/app';
// Route imports
import PhotoRouter from './resources/photo/photo.router';

require('dotenv').config();

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

// FGunction to start the server
const startServer = async () => {
  try {
    // Connect to db
    await connectToDB();
    const port = process.env.PORT || 5555;
    app.listen(port, () => {
      console.log(`Server is live and listening on ${port}`);
    });
  } catch (error) {
    console.log('Error connecting to server');
  }
};
// Start the server
startServer();
