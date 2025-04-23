import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserRequest extends Request {
  userID?: string;
}

export const userMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    
    console.log("Token received:", token ? "Yes" : "No");

    if (!token) {
       res.status(401).json({ message: 'Authentication token is missing' });
       return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id?: string };

    if (decoded && typeof decoded.id === 'string') {
      req.userID = decoded.id;
      console.log("userID extracted:", req.userID);
      next();
    } else {
      throw new Error('User ID is not valid in token');
    }

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};