import { getDatabase } from '../db';
import { Request, Response, NextFunction } from 'express';

export function checkDatabaseExists(req: Request, res: Response, next: NextFunction) {
  try {
    getDatabase();
  } catch (error) {
    return res.status(500).json({ error: 'Database not found' });
  }
  next();
}
