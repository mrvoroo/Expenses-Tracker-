import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  type DocumentData,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Expense, Budget } from '../types/expense.types';
import { STORAGE_KEYS } from '../utils/constants';

const EXPENSES_COLLECTION = 'expenses';
const BUDGETS_COLLECTION = 'budgets';

function expenseFromDoc(id: string, data: DocumentData): Expense {
  const createdAt = data.createdAt?.toDate?.() ?? new Date(data.createdAt);
  const date = data.date?.toDate?.() ?? new Date(data.date);
  return {
    id,
    amount: data.amount,
    category: data.category,
    description: data.description ?? '',
    date: typeof date === 'string' ? date : date.toISOString().split('T')[0],
    userId: data.userId,
    createdAt: typeof createdAt === 'string' ? createdAt : createdAt.toISOString(),
  };
}

export async function addExpense(userId: string, expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<Expense> {
  const ref = await addDoc(collection(db, EXPENSES_COLLECTION), {
    ...expense,
    userId,
    date: expense.date,
    createdAt: Timestamp.now(),
  });
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Failed to create expense');
  return expenseFromDoc(snap.id, snap.data());
}

export async function updateExpense(id: string, updates: Partial<Pick<Expense, 'amount' | 'category' | 'description' | 'date'>>): Promise<void> {
  await updateDoc(doc(db, EXPENSES_COLLECTION, id), updates as DocumentData);
}

export async function deleteExpense(id: string): Promise<void> {
  await deleteDoc(doc(db, EXPENSES_COLLECTION, id));
}

export async function getExpensesByUser(userId: string, fromDate?: string, toDate?: string): Promise<Expense[]> {
  const q = query(collection(db, EXPENSES_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  let list = snapshot.docs.map((d) => expenseFromDoc(d.id, d.data()));

  if (fromDate || toDate) {
    list = list.filter((e) => {
      if (fromDate && e.date < fromDate) return false;
      if (toDate && e.date > toDate) return false;
      return true;
    });
  }
  list.sort((a, b) => (b.date > a.date ? 1 : -1));
  return list;
}

export async function getBudget(userId: string): Promise<Budget | null> {
  const q = query(collection(db, BUDGETS_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const docSnap = snapshot.docs[0];
  if (!docSnap?.exists()) return null;
  const data = docSnap.data();
  return {
    userId: data.userId,
    monthlyBudget: data.monthlyBudget ?? 0,
    categoryBudgets: data.categoryBudgets ?? {},
    alertsEnabled: data.alertsEnabled ?? true,
    alertThreshold: data.alertThreshold ?? 80,
    currency: data.currency ?? 'ج.م',
    customCategories: data.customCategories ?? [],
  };
}

export async function setBudget(userId: string, budget: Omit<Budget, 'userId'>): Promise<void> {
  const q = query(collection(db, BUDGETS_COLLECTION), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  const colRef = collection(db, BUDGETS_COLLECTION);
  batch.set(doc(colRef), { ...budget, userId });
  await batch.commit();
}

// Local storage fallback for offline / no Firebase
export function getPendingExpensesFromStorage(): Expense[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_EXPENSES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePendingExpenseToStorage(expense: Omit<Expense, 'id' | 'createdAt'>): void {
  const list = getPendingExpensesFromStorage();
  const newItem: Expense = {
    ...expense,
    id: `local_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newItem);
  localStorage.setItem(STORAGE_KEYS.PENDING_EXPENSES, JSON.stringify(list.slice(0, 100)));
}

export function clearPendingExpensesFromStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.PENDING_EXPENSES);
}
