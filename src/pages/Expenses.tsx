import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { Modal } from '../components/shared/Modal';
import { Button } from '../components/shared/Button';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import type { Expense, ExpenseFormData } from '../types/expense.types';
import { toast } from 'react-toastify';

export function Expenses() {
  const { user } = useAuth();
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(user?.uid);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  async function handleSubmit(data: ExpenseFormData) {
    if (!user) return;
    try {
      if (editing) {
        await updateExpense(editing.id, data);
        toast.success('تم تحديث المصروف');
      } else {
        await addExpense(data);
        toast.success('تمت إضافة المصروف');
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'حدث خطأ');
    }
  }

  function handleEdit(expense: Expense) {
    setEditing(expense);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('هل تريد حذف هذا المصروف؟')) return;
    try {
      await deleteExpense(id);
      toast.success('تم الحذف');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'فشل الحذف');
    }
  }

  function openAddModal() {
    setEditing(null);
    setModalOpen(true);
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        سجّل الدخول لإضافة وتعديل المصاريف.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">المصاريف</h1>
        <Button onClick={openAddModal}>
          <FiPlus className="w-5 h-5 ml-2" />
          إضافة مصروف
        </Button>
      </div>
      <ExpenseList
        expenses={expenses}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        title={editing ? 'تعديل مصروف' : 'إضافة مصروف جديد'}
      >
        <ExpenseForm
          key={editing?.id ?? 'new'}
          defaultDate={editing?.date}
          initialValues={editing ? { amount: editing.amount, category: editing.category, description: editing.description, date: editing.date } : undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditing(null); }}
        />
      </Modal>
    </div>
  );
}
