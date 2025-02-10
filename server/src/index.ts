import express from 'express';
import cors from 'cors';
import { createApiRouter } from './routes/api';
import { createAppRouter } from './routes/app';
import { createDatabase } from './db';

const app = express();
const PORT = process.env.PORT || 5000;

const db = createDatabase();

app.use(cors());
app.use(express.json());

app.use('/', createAppRouter());
app.use('/api', createApiRouter(db));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Clean up database on exit
process.on('exit', () => db.close());
