import Database from 'better-sqlite3';

let db: Database.Database | undefined;

export function createDatabase() {
  if (!db) {
    db = new Database(':memory:');

    db.exec(`
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quantity INTEGER NOT NULL,
            sku TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            store TEXT NOT NULL
        )
        `);
  }

  return db;
}

export function getDatabase() {
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = undefined;
  }
}

export function resetDatabase() {
  closeDatabase();
  createDatabase();
}
