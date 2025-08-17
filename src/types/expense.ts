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
  { id: 'food', name: 'طعام وشراب', icon: 'UtensilsCrossed', color: '#FF6B6B', type: 'expense' },
  { id: 'transport', name: 'مواصلات', icon: 'Car', color: '#4ECDC4', type: 'expense' },
  { id: 'shopping', name: 'تسوق', icon: 'ShoppingBag', color: '#45B7D1', type: 'expense' },
  { id: 'bills', name: 'فواتير', icon: 'Zap', color: '#F7DC6F', type: 'expense' },
  { id: 'health', name: 'صحة', icon: 'Heart', color: '#BB8FCE', type: 'expense' },
  { id: 'entertainment', name: 'ترفيه', icon: 'Film', color: '#85C1E9', type: 'expense' },
  { id: 'education', name: 'تعليم', icon: 'GraduationCap', color: '#82E0AA', type: 'expense' },
  { id: 'other', name: 'أخرى', icon: 'MoreHorizontal', color: '#D5A6BD', type: 'expense' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'راتب', icon: 'Briefcase', color: '#27AE60', type: 'income' },
  { id: 'business', name: 'أعمال', icon: 'Building2', color: '#2ECC71', type: 'income' },
  { id: 'freelance', name: 'عمل حر', icon: 'Laptop', color: '#58D68D', type: 'income' },
  { id: 'investment', name: 'استثمار', icon: 'TrendingUp', color: '#85C1E9', type: 'income' },
  { id: 'gift', name: 'هدية', icon: 'Gift', color: '#F8C471', type: 'income' },
  { id: 'other-income', name: 'أخرى', icon: 'DollarSign', color: '#AED6F1', type: 'income' },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'دولار أمريكي' },
  { code: 'EUR', symbol: '€', name: 'يورو' },
  { code: 'GBP', symbol: '£', name: 'جنيه إسترليني' },
  { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي' },
  { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي' },
  { code: 'EGP', symbol: 'ج.م', name: 'جنيه مصري' },
  { code: 'JOD', symbol: 'د.أ', name: 'دينار أردني' },
  { code: 'KWD', symbol: 'د.ك', name: 'دينار كويتي' },
  { code: 'QAR', symbol: 'ر.ق', name: 'ريال قطري' },
  { code: 'BHD', symbol: 'د.ب', name: 'دينار بحريني' },
  { code: 'OMR', symbol: 'ر.ع', name: 'ريال عماني' },
  { code: 'LBP', symbol: 'ل.ل', name: 'ليرة لبنانية' },
  { code: 'MAD', symbol: 'د.م', name: 'درهم مغربي' },
  { code: 'TND', symbol: 'د.ت', name: 'دينار تونسي' },
  { code: 'DZD', symbol: 'د.ج', name: 'دينار جزائري' },
];