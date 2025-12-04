import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types/finance";

const FUNCTION_NAME = 'mongodb-api';

interface MongoTransaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
    body: { action: 'getTransactions' },
  });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  const documents = data?.documents || [];
  
  return documents.map((doc: MongoTransaction) => ({
    id: doc._id,
    type: doc.type,
    amount: doc.amount,
    category: doc.category,
    description: doc.description,
    date: new Date(doc.date),
    createdAt: new Date(doc.createdAt),
  }));
}

export async function addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<string> {
  const { data, error } = await supabase.functions.invoke(FUNCTION_NAME, {
    body: {
      action: 'addTransaction',
      data: {
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date.toISOString(),
      },
    },
  });

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return data?.insertedId || '';
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.functions.invoke(FUNCTION_NAME, {
    body: {
      action: 'deleteTransaction',
      data: { id },
    },
  });

  if (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
