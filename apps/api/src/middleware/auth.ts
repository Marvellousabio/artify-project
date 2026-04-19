import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        avatar?: string;
      };
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Check for Clerk JWT token
    const clerkToken = req.headers.authorization?.replace('Bearer ', '');

    if (clerkToken) {
      // Verify Clerk token (simplified - in production use Clerk SDK)
      try {
        // For now, just decode the token - in production validate with Clerk
        const decoded = jwt.decode(clerkToken) as any;
        if (decoded) {
          req.user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            avatar: decoded.avatar,
          };
          return next();
        }
      } catch (error) {
        console.error('Clerk token verification failed:', error);
      }
    }

    // Check for custom JWT token
    const customToken = req.headers['x-api-key'] as string;

    if (customToken && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(customToken, process.env.JWT_SECRET) as any;
        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          avatar: decoded.avatar,
        };
        return next();
      } catch (error) {
        console.error('Custom JWT verification failed:', error);
      }
    }

    // No valid authentication found
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide a valid authentication token'
    });

  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'Internal server error during authentication'
    });
  }
}