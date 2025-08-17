import { Transaction } from '@/types/expense';

export const sampleTransactions: Omit<Transaction, 'id' | 'createdAt'>[] = [
  {
    amount: 5000,
    type: 'income',
    category: 'salary',
    description: 'راتب شهر ديسمبر',
    date: new Date('2024-12-01'),
  },
  {
    amount: 1200,
    type: 'expense',
    category: 'food',
    description: 'تسوق شهري من السوبر ماركت',
    date: new Date('2024-12-02'),
  },
  {
    amount: 300,
    type: 'expense',
    category: 'transport',
    description: 'وقود السيارة',
    date: new Date('2024-12-03'),
  },
  {
    amount: 150,
    type: 'expense',
    category: 'bills',
    description: 'فاتورة الكهرباء',
    date: new Date('2024-12-04'),
  },
  {
    amount: 800,
    type: 'expense',
    category: 'shopping',
    description: 'شراء ملابس شتوية',
    date: new Date('2024-12-05'),
  },
  {
    amount: 200,
    type: 'expense',
    category: 'entertainment',
    description: 'وجبة في المطعم مع الأصدقاء',
    date: new Date('2024-12-06'),
  },
  {
    amount: 500,
    type: 'income',
    category: 'freelance',
    description: 'مشروع تصميم موقع ويب',
    date: new Date('2024-12-07'),
  },
  {
    amount: 100,
    type: 'expense',
    category: 'health',
    description: 'زيارة طبيب الأسنان',
    date: new Date('2024-12-08'),
  },
  {
    amount: 75,
    type: 'expense',
    category: 'bills',
    description: 'فاتورة الهاتف',
    date: new Date('2024-12-09'),
  },
  {
    amount: 250,
    type: 'expense',
    category: 'food',
    description: 'طلبات خارجية أسبوعية',
    date: new Date('2024-12-10'),
  },
];