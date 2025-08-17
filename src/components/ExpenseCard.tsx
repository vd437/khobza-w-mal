import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  title: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense' | 'balance';
  icon: React.ReactNode;
  className?: string;
  hideAmount?: boolean;
}

export function ExpenseCard({ 
  title, 
  amount, 
  currency, 
  type, 
  icon, 
  className,
  hideAmount = false 
}: ExpenseCardProps) {
  const formatAmount = (value: number) => {
    if (hideAmount) return '****';
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency === 'USD' ? 'USD' : 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const getCardStyle = () => {
    switch (type) {
      case 'income':
        return 'border-success/20 bg-gradient-to-br from-success/5 to-success/10 hover:shadow-lg hover:shadow-success/20';
      case 'expense':
        return 'border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10 hover:shadow-lg hover:shadow-danger/20';
      case 'balance':
        return amount >= 0 
          ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg hover:shadow-primary/20'
          : 'border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10 hover:shadow-lg hover:shadow-danger/20';
      default:
        return '';
    }
  };

  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return 'text-success';
      case 'expense':
        return 'text-danger';
      case 'balance':
        return amount >= 0 ? 'text-success' : 'text-danger';
      default:
        return 'text-foreground';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-300 cursor-pointer hover:scale-105",
      getCardStyle(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center",
          type === 'income' && "bg-success/10 text-success",
          type === 'expense' && "bg-danger/10 text-danger",
          type === 'balance' && amount >= 0 && "bg-primary/10 text-primary",
          type === 'balance' && amount < 0 && "bg-danger/10 text-danger"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-2xl font-bold transition-colors",
          getAmountColor()
        )}>
          {type === 'balance' && amount < 0 && '-'}
          {formatAmount(amount)}
        </div>
        {type === 'balance' && (
          <p className="text-xs text-muted-foreground mt-1">
            {amount >= 0 ? 'رصيد إيجابي' : 'رصيد سالب'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}