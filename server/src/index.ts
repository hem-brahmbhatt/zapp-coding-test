import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { createApiRouter } from './routes/api';
import { createAppRouter } from './routes/app';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize in-memory database
const db = new Database(':memory:');

// Create inventory table
db.exec(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quantity INTEGER NOT NULL,
    sku TEXT NOT NULL,
    description TEXT NOT NULL,
    store TEXT NOT NULL
  )
`);

app.use(cors());
app.use(express.json());

app.use('/', createAppRouter());
app.use('/api', createApiRouter(db));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Clean up database on exit
process.on('exit', () => db.close());
