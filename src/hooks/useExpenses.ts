import { useState, useEffect, useCallback } from 'react';
import type { Expense } from '../types/expense.types';
import {
  getExpensesByUser,
  addExpense as addExpenseApi,
  updateExpense as updateExpenseApi,
  deleteExpense as deleteExpenseApi,
} from '../services/expenseService';
import { getStartOfMonth, getEndOfMonth } from '../utils/formatters';

export function useExpenses(userId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(
    async (from?: string, to?: string) => {
      if (!userId) {
        setExpenses([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const list = await getExpensesByUser(userId, from, to);
        setExpenses(list);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'فشل تحميل المصاريف');
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  async function addExpense(data: Omit<Expense, 'id' | 'userId' | 'createdAt'>) {
    if (!userId) throw new Error('يجب تسجيل الدخول');
    const created = await addExpenseApi(userId, data);
    setExpenses((prev) => [created, ...prev]);
    return created;
  }

  async function updateExpense(id: string, updates: Partial<Pick<Expense, 'amount' | 'category' | 'description' | 'date'>>) {
    await updateExpenseApi(id, updates);
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }

  async function deleteExpense(id: string) {
    await deleteExpenseApi(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  function getMonthExpenses(year: number, month: number): Expense[] {
    const start = getStartOfMonth(new Date(year, month, 1));
    const end = getEndOfMonth(start);
    const from = start.toISOString().split('T')[0];
    const to = end.toISOString().split('T')[0];
    return expenses.filter((e) => e.date >= from && e.date <= to);
  }

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getMonthExpenses,
  };
}
