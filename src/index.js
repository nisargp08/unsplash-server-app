import express from 'express';
import { json, urlencoded } from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('dev'));

app.listen(5000, () => {
  console.log('Server is live and listening on : 5000');
});
