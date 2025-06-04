// const express = require("express");
import express from 'express';
// const cors = require("cors");
import cors from 'cors';
// const cookieParser = require("cookie-parser");
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRouter from './routes/user.route.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

// parse the request coming from the body into the json
app.use(express.json());

// cross origin resource sharing
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || ''],
    credentials: true, // flow of credentials
  })
);

// parse the cookie inside the token
app.use(cookieParser());

// show the url user accessing in the console, logger middleware
app.use(morgan('dev'));

app.use('/ping', function (req, res) {
  res.send('pong');
});

// routes of 3 modules
app.use('/api/v1/user', userRouter);

// have to use app.all
app.all('', (req, res) => {
  res.status(404).send('OOPS!! 404 page not found');
});

// Ensure errorMiddleware has correct types
// redirect to the error middleware in any error in controllers and show the results
app.use(errorMiddleware);

// module.exports = app;
export default app;
