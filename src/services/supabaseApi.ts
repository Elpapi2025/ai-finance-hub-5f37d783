import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types/finance';

/**
 * Fetches all transactions for the currently authenticated user.
 * RLS policy ensures that only the user's own transactions are returned.
 */
export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions from Supabase:', error);
    throw error;
  }

  // The table schema in Supabase should match the Transaction type.
  return data as Transaction[];
}

/**
 * Adds a single transaction for the currently authenticated user.
 * The `user_id` is automatically inferred from the session on the backend via RLS policies.
 * However, we must provide it here to satisfy the INSERT policy's CHECK expression.
 * @param transaction - The transaction object, without the 'id' and 'user_id'.
 */
export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated. Cannot add transaction.');
  }

  const transactionData = {
    ...transaction,
    user_id: user.id, // Explicitly set user_id to satisfy the INSERT policy check
  };

  const { data: newTransaction, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single(); // .single() returns the inserted row object instead of an array

  if (error) {
    console.error('Error adding transaction to Supabase:', error);
    throw error;
  }

  return newTransaction as Transaction;
}

/**
 * Adds multiple transactions in a single batch for the currently authenticated user.
 * @param transactions - An array of transaction objects, without the 'id'.
 */
export async function addTransactions(transactions: Omit<Transaction, 'id'>[]): Promise<Transaction[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated. Cannot add transactions.');
  }

  // Add user_id to each transaction
  const transactionsData = transactions.map(t => ({
    ...t,
    user_id: user.id,
  }));

  const { data: newTransactions, error } = await supabase
    .from('transactions')
    .insert(transactionsData)
    .select();

  if (error) {
    console.error('Error bulk adding transactions to Supabase:', error);
    throw error;
  }

  return newTransactions as Transaction;
}

/**
 * Clears all transactions for the currently authenticated user from Supabase.
 * RLS policy should ensure a user can only clear their own transactions.
 */
export async function clearUserTransactions(): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated. Cannot clear transactions.');
  }

  // Delete all transactions for the current user
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', user.id); // Assuming RLS allows this based on user_id

  if (error) {
    console.error('Error clearing user transactions from Supabase:', error);
    throw error;
  }
}

/**
 * Deletes a transaction by its ID.
 * RLS policy ensures a user can only delete their own transactions.
 * @param id - The UUID of the transaction to delete.
 */
export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting transaction from Supabase:', error);
    throw error;
  }
}

/**
 * Updates a transaction by its ID.
 * RLS policy ensures a user can only update their own transactions.
 * @param id — The UUID of the transaction to update.
 * @param updates — An object containing the fields to update.
 */
export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const { data: updatedTransaction, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating transaction in Supabase:', error);
        throw error;
    }

    return updatedTransaction as Transaction;
}