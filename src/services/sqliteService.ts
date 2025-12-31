import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, capSQLiteSet } from '@capacitor-community/sqlite';
import { Transaction } from '../types/finance';

let sqliteConnection: SQLiteConnection;
let db: SQLiteDBConnection | null = null;
const DB_NAME = 'finance_hub.db';
const TABLE_NAME = 'transactions';

const initializeDatabase = async () => {
  if (db) return; // DB already initialized

  try {
    sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    const ret = await sqliteConnection.checkConnectionsConsistency();
    // console.log(`after checkConnectionsConsistency: ${ret.result}`); // Debug log

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
      throw new Error('Failed to create SQLite connection listener.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    db = null; // Ensure db is null if initialization fails
    throw error; // Propagate the error
  }
};

const ensureDbInitialized = async () => {
  if (!db) {
    await initializeDatabase();
  }
  if (!db) {
    throw new Error('Database is not initialized and could not be initialized.');
  }
};

const addTransaction = async (transaction: Transaction) => {
  await ensureDbInitialized();
  console.log('Adding transaction:', transaction); // Debug log
  const query = `
    INSERT INTO ${TABLE_NAME} (id, name, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?);
  `;
  await db!.run(query, [ // Use db! because ensureDbInitialized guarantees it's not null
    transaction.id,
    transaction.name,
    transaction.amount,
    transaction.type,
    transaction.category,
    transaction.date,
  ]);
};

const getTransactions = async (): Promise<Transaction[]> => {
  await ensureDbInitialized();
  const query = `SELECT * FROM ${TABLE_NAME};`;
  const res = await db!.query(query);
  return res.values as Transaction[] || [];
};

const updateTransaction = async (transaction: Transaction) => {
  await ensureDbInitialized();
  const query = `
    UPDATE ${TABLE_NAME} SET name=?, amount=?, type=?, category=?, date=? WHERE id=?;
  `;
  await db!.run(query, [
    transaction.name,
    transaction.amount,
    transaction.type,
    transaction.category,
    transaction.date,
    transaction.id,
  ]);
};

const deleteTransaction = async (id: string) => {
  await ensureDbInitialized();
  const query = `DELETE FROM ${TABLE_NAME} WHERE id=?;`;
  await db!.run(query, [id]);
};

const clearAllTransactions = async () => {
  await ensureDbInitialized();
  const query = `DELETE FROM ${TABLE_NAME};`;
  await db!.run(query);
  console.log('All transactions cleared.');
};

const exportTransactionsToJson = async (): Promise<string> => {
  await ensureDbInitialized();
  const transactions = await getTransactions();
  return JSON.stringify(transactions, null, 2); // Pretty print JSON
};

const importTransactionsFromJson = async (jsonString: string) => {
  await ensureDbInitialized();
  try {
    const transactions: Transaction[] = JSON.parse(jsonString);
    await clearAllTransactions(); // Clear existing data before importing

    // Begin a transaction for performance and data integrity
    await db!.beginTransaction();
    for (const transaction of transactions) {
      // Re-add to ensure data integrity and proper ID handling
      await addTransaction(transaction); 
    }
    await db!.commitTransaction();
    console.log('Transactions imported successfully.');
  } catch (error) {
    console.error('Error importing transactions from JSON:', error);
    await db!.rollbackTransaction(); // Rollback if any error occurs
    throw error; // Re-throw to propagate error to caller
  }
};

export { initializeDatabase, addTransaction, getTransactions, updateTransaction, deleteTransaction, clearAllTransactions, exportTransactionsToJson, importTransactionsFromJson };
