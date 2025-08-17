import { ExpenseCard } from "@/components/ExpenseCard";
import { ExpenseChart } from "@/components/ExpenseChart";
import { SampleDataButton } from "@/components/SampleDataButton";
import { useExpense } from "@/contexts/ExpenseContext";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export function Dashboard() {
  const { state } = useExpense();
  const { stats, settings } = state;

  return (
    <div className="space-y-6">
      {/* البطاقات الإحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ExpenseCard
          title="الرصيد الحالي"
          amount={stats.balance}
          currency={settings.currency}
          type="balance"
          icon={<Wallet className="h-4 w-4" />}
          hideAmount={settings.hideAmounts}
        />
        <ExpenseCard
          title="إجمالي الدخل"
          amount={stats.totalIncome}
          currency={settings.currency}
          type="income"
          icon={<TrendingUp className="h-4 w-4" />}
          hideAmount={settings.hideAmounts}
        />
        <ExpenseCard
          title="إجمالي المصروفات"
          amount={stats.totalExpenses}
          currency={settings.currency}
          type="expense"
          icon={<TrendingDown className="h-4 w-4" />}
          hideAmount={settings.hideAmounts}
        />
        <ExpenseCard
          title="مصروفات هذا الشهر"
          amount={stats.monthlyExpenses}
          currency={settings.currency}
          type="expense"
          icon={<DollarSign className="h-4 w-4" />}
          hideAmount={settings.hideAmounts}
        />
      </div>

      {/* الرسم البياني */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        
        {/* بطاقة ملخص سريع */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-lg p-6 border border-primary/20">
            <h3 className="text-lg font-semibold mb-4 text-primary">ملخص هذا الشهر</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">الدخل الشهري</span>
                <span className="font-semibold text-success">
                  {settings.hideAmounts ? '****' : new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: settings.currency,
                    minimumFractionDigits: 0,
                  }).format(stats.monthlyIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">المصروفات الشهرية</span>
                <span className="font-semibold text-danger">
                  {settings.hideAmounts ? '****' : new Intl.NumberFormat('ar-SA', {
                    style: 'currency',
                    currency: settings.currency,
                    minimumFractionDigits: 0,
                  }).format(stats.monthlyExpenses)}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">صافي الدخل الشهري</span>
                  <span className={`font-bold text-lg ${
                    stats.monthlyIncome - stats.monthlyExpenses >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {settings.hideAmounts ? '****' : new Intl.NumberFormat('ar-SA', {
                      style: 'currency',
                      currency: settings.currency,
                      minimumFractionDigits: 0,
                    }).format(stats.monthlyIncome - stats.monthlyExpenses)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* نصائح سريعة */}
          <div className="bg-gradient-to-br from-secondary/10 to-secondary-glow/10 rounded-lg p-6 border border-secondary/20">
            <h3 className="text-lg font-semibold mb-4 text-secondary flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              نصائح مالية
            </h3>
            <div className="space-y-2 text-sm">
              {stats.monthlyExpenses > stats.monthlyIncome && (
                <p className="text-danger flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  مصروفاتك الشهرية تتجاوز دخلك
                </p>
              )}
              {stats.balance < 0 && (
                <p className="text-danger flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  رصيدك سالب، راجع مصروفاتك
                </p>
              )}
              {stats.monthlyExpenses === 0 && (
                <p className="text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  ابدأ بإضافة مصروفاتك لتتبع أفضل
                </p>
              )}
              {stats.balance > 0 && stats.monthlyIncome > stats.monthlyExpenses && (
                <p className="text-success flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  أحسنت! لديك فائض مالي هذا الشهر
                </p>
              )}
              <p className="text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                راجع مصروفاتك بانتظام لتحقيق أهدافك المالية
              </p>
            </div>
          </div>

          {/* زر البيانات التجريبية */}
          <SampleDataButton />
        </div>
      </div>
    </div>
  );
}