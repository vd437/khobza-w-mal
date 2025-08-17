import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, TrendingUp, TrendingDown, Filter, CreditCard, UtensilsCrossed, Car, ShoppingBag, Zap, Heart, Film, GraduationCap, MoreHorizontal, Briefcase, Building2, Laptop, Gift, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useExpense } from "@/contexts/ExpenseContext";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types/expense";
import { cn } from "@/lib/utils";

export function TransactionsList() {
  const { state, deleteTransaction } = useExpense();
  const { transactions, settings } = state;
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  const filteredTransactions = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => categoryFilter === 'all' || t.category === categoryFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50); // عرض آخر 50 معاملة

  const formatAmount = (amount: number, currency: string) => {
    if (settings.hideAmounts) return '****';
    
    const currencyMap: { [key: string]: string } = {
      'USD': 'USD', 'EUR': 'EUR', 'GBP': 'GBP',
      'SAR': 'SAR', 'AED': 'AED', 'EGP': 'EGP',
      'JOD': 'JOD', 'KWD': 'KWD', 'QAR': 'QAR',
      'BHD': 'BHD', 'OMR': 'OMR', 'LBP': 'LBP',
      'MAD': 'MAD', 'TND': 'TND', 'DZD': 'DZD'
    };
    
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currencyMap[currency] || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryInfo = (categoryId: string) => {
    return allCategories.find(c => c.id === categoryId) || {
      name: categoryId,
      icon: 'MoreHorizontal',
      color: '#8884d8'
    };
  };
  
  const renderCategoryIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'UtensilsCrossed': UtensilsCrossed,
      'Car': Car,
      'ShoppingBag': ShoppingBag,
      'Zap': Zap,
      'Heart': Heart,
      'Film': Film,
      'GraduationCap': GraduationCap,
      'MoreHorizontal': MoreHorizontal,
      'Briefcase': Briefcase,
      'Building2': Building2,
      'Laptop': Laptop,
      'TrendingUp': TrendingUp,
      'Gift': Gift,
      'DollarSign': DollarSign,
    };
    
    const IconComponent = iconMap[iconName] || MoreHorizontal;
    return <IconComponent className="h-5 w-5" />;
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4">
            <CreditCard className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">لا توجد معاملات</h3>
          <p className="text-muted-foreground text-center">
            ابدأ بإضافة معاملاتك المالية لتتبع مصاريفك ودخلك
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* فلاتر */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            تصفية المعاملات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع المعاملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المعاملات</SelectItem>
                  <SelectItem value="income">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-success" />
                      الدخل فقط
                    </div>
                  </SelectItem>
                  <SelectItem value="expense">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-danger" />
                      المصروفات فقط
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  {allCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        {renderCategoryIcon(category.icon)}
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة المعاملات */}
      <Card>
        <CardHeader>
          <CardTitle>آخر المعاملات ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const categoryInfo = getCategoryInfo(transaction.category);
              return (
                <div
                  key={transaction.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border transition-colors hover:bg-muted/50",
                    transaction.type === 'income' 
                      ? "border-success/20 bg-success/5" 
                      : "border-danger/20 bg-danger/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    transaction.type === 'income' ? "bg-success/10" : "bg-danger/10"
                  )}>
                    {renderCategoryIcon(categoryInfo.icon)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{transaction.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className="text-xs shrink-0"
                        style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
                      >
                        {categoryInfo.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate">
                        {format(new Date(transaction.date), 'dd MMM yyyy', { locale: ar })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={cn(
                      "text-right font-semibold whitespace-nowrap",
                      transaction.type === 'income' ? "text-success" : "text-danger"
                    )}>
                      <div className="flex items-center gap-1">
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm">{formatAmount(transaction.amount, settings.currency)}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}