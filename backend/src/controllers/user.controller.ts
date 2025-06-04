import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/error.util';
import User from '../models/user.model';

// Handling the types of the request, response, next
type ExpressHandler = (req: Request, res: Response, next: NextFunction) => any;

// Registration controller
const register: ExpressHandler = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  // checking and giving response if any field or detail is missing
  if (!fullName || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }

  // checking if the user exists or not
  const userExists = await User.findOne({ email });

  // giving response if the user already exists
  if (userExists) {
    return next(new AppError('User already exists', 400));
  }

  // creating user in the database
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: 'www.google.com',
    },
  });

  // if the user is not created in the database
  if (!user) {
    return next(new AppError('User registration failed, Please try again', 400));
  }

  //TODO: file upload

  // save the user in the database
  await user.save();

  // removing the password before sending data to the user
  user.password = '';

  // creating the jwt token
  const token = await generateJwtToken();

  // sending the final data and response to the user
  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
};

const login: ExpressHandler = (req, res, next) => {};

const logout: ExpressHandler = (req, res, next) => {};

const getProfile: ExpressHandler = (req, res, next) => {};

export { register, login, logout, getProfile };
