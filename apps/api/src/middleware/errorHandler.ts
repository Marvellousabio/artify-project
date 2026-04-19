import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: error.message,
      details: error.errors,
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
      message: 'The provided authentication token is invalid',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token Expired',
      message: 'The authentication token has expired',
    });
  }

  // Prisma errors
  if (error.code) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Conflict',
          message: 'A record with this information already exists',
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Not Found',
          message: 'The requested resource was not found',
        });
      default:
        console.error('Prisma error:', error);
        break;
    }
  }

  // Default error response
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
    message: process.env.NODE_ENV === 'development' ? message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}