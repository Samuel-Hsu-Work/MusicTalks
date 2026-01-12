import { Request, Response, NextFunction } from 'express';

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement JWT authentication middleware
  next();
};
