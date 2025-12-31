import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, capSQLiteSet } from '@capacitor-community/sqlite';
import { Transaction } from '../types/finance';

let sqliteConnection: SQLiteConnection;
let db: SQLiteDBConnection | null = null;
const DB_NAME = 'finance_hub.db';
const TABLE_NAME = 'transactions';

const initializeDatabase = async () => {
  if (db) return; // DB already initialized

  sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  const ret = await sqliteConnection.checkConnectionsConsistency();
  const is           = ret.result;
  console.log(`after checkConnectionsConsistency: ${is}`);
  const dbListeners = await sqliteConnection.createConnection(DB_NAME, false, 'no-encryption', 1, false);

  if (dbListeners) {
    db = dbListeners;
    await db.open();

    const query = `
      CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `;
    await db.execute(query);
    console.log('Database and table created/opened successfully');
  } else {
    console.error('Failed to create SQLite connection.');
  }
};

const addTransaction = async (transaction: Transaction) => {
  if (!db) {
    console.error('Database not initialized.');
    return;
  }
  const query = `
    INSERT INTO ${TABLE_NAME} (id, name, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?);
  `;
  await db.run(query, [
    transaction.id,
    transaction.name,
    transaction.amount,
    transaction.type,
    transaction.category,
    transaction.date,
  ]);
};

const getTransactions = async (): Promise<Transaction[]> => {
  if (!db) {
    console.error('Database not initialized.');
    return [];
  }
  const query = `SELECT * FROM ${TABLE_NAME};`;
  const res = await db.query(query);
  return res.values as Transaction[] || [];
};

const updateTransaction = async (transaction: Transaction) => {
  if (!db) {
    console.error('Database not initialized.');
    return;
  }
  const query = `
    UPDATE ${TABLE_NAME} SET name=?, amount=?, type=?, category=?, date=? WHERE id=?;
  `;
  await db.run(query, [
    transaction.name,
    transaction.amount,
    transaction.type,
    transaction.category,
    transaction.date,
    transaction.id,
  ]);
};

const deleteTransaction = async (id: string) => {
  if (!db) {
    console.error('Database not initialized.');
    return;
  }
  const query = `DELETE FROM ${TABLE_NAME} WHERE id=?;`;
  await db.run(query, [id]);
};

export { initializeDatabase, addTransaction, getTransactions, updateTransaction, deleteTransaction };
