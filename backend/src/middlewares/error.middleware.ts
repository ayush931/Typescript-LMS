import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  // getting the data from error utils and then sending in return to the user
  (err.statusCode = err.statusCode || 500), (err.message = err.message || 'Something went wrong');

  return res.status(err.statusCode).json({
    success: false,
    error: err.message,
    stack: err.stack,
  });
};

export default errorMiddleware;
