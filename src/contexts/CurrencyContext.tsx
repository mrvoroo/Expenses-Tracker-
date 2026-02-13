import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getBudget } from '../services/expenseService';
import { EXPENSE_CATEGORIES } from '../utils/constants';

export type CategoryItem = { value: string; label: string; icon: string };

type CurrencyContextValue = {
  currency: string;
  setCurrency: (currency: string) => void;
  customCategories: { value: string; label: string }[];
  setCustomCategories: (cats: { value: string; label: string }[]) => void;
  refreshBudget: () => Promise<void>;
  /** فئات المصاريف (الافتراضية + المخصصة) للاستخدام في النماذج والرسوم */
  expenseCategories: CategoryItem[];
};

const defaultCurrency = 'ج.م';
const CurrencyContext = createContext<CurrencyContextValue>({
  currency: defaultCurrency,
  setCurrency: () => {},
  customCategories: [],
  setCustomCategories: () => {},
  refreshBudget: async () => {},
  expenseCategories: EXPENSE_CATEGORIES.map((c) => ({ ...c, value: c.value as string })),
});

function mergeCategories(custom: { value: string; label: string }[]): CategoryItem[] {
  const builtIn = EXPENSE_CATEGORIES.map((c) => ({ value: c.value as string, label: c.label, icon: c.icon }));
  const customItems = custom.map((c) => ({ ...c, icon: '📌' }));
  return [...builtIn, ...customItems];
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currency, setCurrencyState] = useState(defaultCurrency);
  const [customCategories, setCustomCategoriesState] = useState<{ value: string; label: string }[]>([]);

  const refreshBudget = useCallback(async () => {
    if (!user?.uid) {
      setCurrencyState(defaultCurrency);
      setCustomCategoriesState([]);
      return;
    }
    try {
      const b = await getBudget(user.uid);
      if (b?.currency) setCurrencyState(b.currency);
      if (b?.customCategories) setCustomCategoriesState(b.customCategories);
    } catch {
      // ignore
    }
  }, [user?.uid]);

  useEffect(() => {
    refreshBudget();
  }, [refreshBudget]);

  function setCurrency(c: string) {
    setCurrencyState(c || defaultCurrency);
  }

  function setCustomCategories(cats: { value: string; label: string }[]) {
    setCustomCategoriesState(cats);
  }

  const expenseCategories = mergeCategories(customCategories);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        customCategories,
        setCustomCategories,
        refreshBudget,
        expenseCategories,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

/** فئات المصاريف (افتراضية + مخصصة) للقوائم والنماذج */
export function useExpenseCategories(): CategoryItem[] {
  const { expenseCategories } = useCurrency();
  return expenseCategories;
}
