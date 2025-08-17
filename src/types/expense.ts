export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  spent: number;
}

export interface Settings {
  currency: string;
  darkMode: boolean;
  hideAmounts: boolean;
  language: 'ar' | 'en';
  budgetAlerts: boolean;
}

export interface ExpenseStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'طعام وشراب', icon: '🍽️', color: '#FF6B6B', type: 'expense' },
  { id: 'transport', name: 'مواصلات', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { id: 'shopping', name: 'تسوق', icon: '🛍️', color: '#45B7D1', type: 'expense' },
  { id: 'bills', name: 'فواتير', icon: '⚡', color: '#F7DC6F', type: 'expense' },
  { id: 'health', name: 'صحة', icon: '🏥', color: '#BB8FCE', type: 'expense' },
  { id: 'entertainment', name: 'ترفيه', icon: '🎬', color: '#85C1E9', type: 'expense' },
  { id: 'education', name: 'تعليم', icon: '📚', color: '#82E0AA', type: 'expense' },
  { id: 'other', name: 'أخرى', icon: '📝', color: '#D5A6BD', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'راتب', icon: '💼', color: '#27AE60', type: 'income' },
  { id: 'business', name: 'أعمال', icon: '🏢', color: '#2ECC71', type: 'income' },
  { id: 'freelance', name: 'عمل حر', icon: '💻', color: '#58D68D', type: 'income' },
  { id: 'investment', name: 'استثمار', icon: '📈', color: '#85C1E9', type: 'income' },
  { id: 'gift', name: 'هدية', icon: '🎁', color: '#F8C471', type: 'income' },
  { id: 'other-income', name: 'أخرى', icon: '💰', color: '#AED6F1', type: 'income' },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'دولار أمريكي' },
  { code: 'EUR', symbol: '€', name: 'يورو' },
  { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي' },
  { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي' },
  { code: 'EGP', symbol: 'ج.م', name: 'جنيه مصري' },
  { code: 'JOD', symbol: 'د.أ', name: 'دينار أردني' },
  { code: 'KWD', symbol: 'د.ك', name: 'دينار كويتي' },
  { code: 'QAR', symbol: 'ر.ق', name: 'ريال قطري' },
];