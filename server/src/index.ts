import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { HelloResponseSchema, type HelloResponse } from './types/api';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

// API routes
app.get('/api/hello', (req: Request, res: Response) => {
  const response: HelloResponse = {
    message: 'Hello from the backend!'
  };
  // Validate response at runtime
  HelloResponseSchema.parse(response);
  res.json(response);
});

// Handle React routing, return all requests to React app
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 