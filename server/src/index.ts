import express from 'express';
import cors from 'cors';
import { createInventoryRouter } from './routes/inventory';
import { createAppRouter } from './routes/app';
import { createDatabase, closeDatabase } from './db';

const app = express();
const PORT = process.env.PORT || 5000;

createDatabase();

app.use(cors());
app.use(express.json());

app.use('/', createAppRouter());
app.use('/api', createInventoryRouter());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Clean up database on exit
process.on('exit', () => closeDatabase());
