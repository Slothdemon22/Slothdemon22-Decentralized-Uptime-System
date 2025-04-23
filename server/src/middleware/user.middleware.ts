import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserRequest extends Request {
  userID?: string;
}

export const userMiddleware = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    console.log("Cookies in request:", req.cookies); // Log the cookies to see if they are being sent correctly
    const token = req.cookies?.token; // Make sure cookie-parser middleware is applied before this
    console.log("Token from cookies:", token);

    if (!token) {
      res.status(401).json({ message: 'Authentication token is missing from cookies' });
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
