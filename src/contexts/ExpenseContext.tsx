import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Transaction, Settings, ExpenseStats, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types/expense';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface ExpenseState {
  transactions: Transaction[];
  settings: Settings;
  stats: ExpenseStats;
}

type ExpenseAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'CALCULATE_STATS' };

const initialSettings: Settings = {
  currency: 'USD',
  darkMode: false,
  hideAmounts: false,
  language: 'ar',
  budgetAlerts: true,
};

const initialState: ExpenseState = {
  transactions: [],
  settings: initialSettings,
  stats: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    categoryBreakdown: [],
  },
};

function calculateStats(transactions: Transaction[]): ExpenseStats {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyTransactions = transactions.filter(t =>
    isWithinInterval(t.date, { start: monthStart, end: monthEnd })
  );

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // حساب توزيع المصروفات حسب الفئة
  const expensesByCategory = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  const categoryBreakdown = Object.entries(expensesByCategory).map(([categoryId, amount]) => {
    const category = allCategories.find(c => c.id === categoryId);
    return {
      category: category?.name || categoryId,
      amount,
      percentage: monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0,
      color: category?.color || '#8884d8',
    };
  });

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    monthlyIncome,
    monthlyExpenses,
    categoryBreakdown,
  };
}

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      const newTransactions = [...state.transactions, action.payload];
      return {
        ...state,
        transactions: newTransactions,
        stats: calculateStats(newTransactions),
      };

    case 'UPDATE_TRANSACTION':
      const updatedTransactions = state.transactions.map(t =>
        t.id === action.payload.id ? action.payload : t
      );
      return {
        ...state,
        transactions: updatedTransactions,
        stats: calculateStats(updatedTransactions),
      };

    case 'DELETE_TRANSACTION':
      const filteredTransactions = state.transactions.filter(t => t.id !== action.payload);
      return {
        ...state,
        transactions: filteredTransactions,
        stats: calculateStats(filteredTransactions),
      };

    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      return {
        ...state,
        settings: newSettings,
      };

    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        stats: calculateStats(action.payload),
      };

    case 'CALCULATE_STATS':
      return {
        ...state,
        stats: calculateStats(state.transactions),
      };

    default:
      return state;
  }
}

interface ExpenseContextType {
  state: ExpenseState;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  exportData: () => void;
  importData: (file: File) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // تحميل البيانات من localStorage عند بدء التطبيق
  useEffect(() => {
    const savedTransactions = localStorage.getItem('expense-transactions');
    const savedSettings = localStorage.getItem('expense-settings');

    if (savedTransactions) {
      try {
        const transactions = JSON.parse(savedTransactions);
        // تحويل التواريخ من string إلى Date
        const parsedTransactions = transactions.map((t: any) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
        }));
        dispatch({ type: 'SET_TRANSACTIONS', payload: parsedTransactions });
      } catch (error) {
        console.error('خطأ في تحميل المعاملات:', error);
      }
    }

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
      }
    }
  }, []);

  // حفظ البيانات في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem('expense-transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('expense-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const updateSettings = (settings: Partial<Settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const exportData = () => {
    const data = {
      transactions: state.transactions,
      settings: state.settings,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.transactions && Array.isArray(data.transactions)) {
            const transactions = data.transactions.map((t: any) => ({
              ...t,
              date: new Date(t.date),
              createdAt: new Date(t.createdAt),
            }));
            dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
          }
          if (data.settings) {
            dispatch({ type: 'UPDATE_SETTINGS', payload: data.settings });
          }
          resolve();
        } catch (error) {
          reject(new Error('ملف غير صالح'));
        }
      };
      reader.onerror = () => reject(new Error('خطأ في قراءة الملف'));
      reader.readAsText(file);
    });
  };

  return (
    <ExpenseContext.Provider
      value={{
        state,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateSettings,
        exportData,
        importData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}