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
// When main server url is requested - display available paths
app.get('*', (req, res) => {
  const availableRoutes = [
    {
      // To get a single file
      methods: 'GET',
      route: '/api/file_upload/:id',
    },
    {
      // To get all files
      methods: 'GET',
      route: '/api/file_upload/',
    },
    {
      // To upload a image
      method: 'POST',
      route: '/api/file_upload/',
    },
    {
      // To Delete a image
      method: 'DELETE',
      route: '/api/file_upload/:id',
    },
  ];
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(availableRoutes, null, 4));
});

// FGunction to start the server
const startServer = async () => {
  try {
    // Connect to db
    await connectToDB();
    const port = process.env.PORT || 5555;
    const listener = app.listen(port, () => {
      console.log(`Server is live and listening on ${listener.address().port}`);
    });
  } catch (error) {
    console.log('Error connecting to server');
  }
};
// Start the server
startServer();
