import express, { Router, Request, Response } from 'express';
import path from 'path';

export const createAppRouter = () => {
  const router = Router();

  // Serve static files from the React app
  router.use(express.static(path.resolve('../client/dist')));

  // Handle React routing, return all requests to React app
  router.get('/', (_: Request, res: Response) => {
    res.sendFile(path.resolve('../client/dist/index.html'));
  });

  return router;
};
