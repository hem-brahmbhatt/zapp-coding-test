import { ZodError, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(parser: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = parser.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
        next();
      }
      res.status(400).json({ error: 'Failed to parse request body' });
      next(error);
    }
  };
}
