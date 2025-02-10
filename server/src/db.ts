import Database from 'better-sqlite3';

export function createDatabase() {
  const db = new Database(':memory:');

  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quantity INTEGER NOT NULL,
        sku TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        store TEXT NOT NULL
    )
    `);

  return db;
}
