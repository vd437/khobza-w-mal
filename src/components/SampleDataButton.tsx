import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useExpense } from "@/contexts/ExpenseContext";
import { sampleTransactions } from "@/data/sampleData";
import { Database } from "lucide-react";

export function SampleDataButton() {
  const { addTransaction, state } = useExpense();
  const { toast } = useToast();

  const loadSampleData = () => {
    if (state.transactions.length > 0) {
      toast({
        title: "تنبيه",
        description: "يوجد بيانات حالية. هل تريد إضافة البيانات التجريبية؟",
        variant: "default",
      });
    }

    sampleTransactions.forEach(transaction => {
      addTransaction(transaction);
    });

    toast({
      title: "تم التحميل",
      description: `تم إضافة ${sampleTransactions.length} معاملة تجريبية`,
    });
  };

  if (state.transactions.length > 5) {
    return null; // إخفاء الزر إذا كان هناك بيانات كافية
  }

  return (
    <Button
      onClick={loadSampleData}
      variant="outline"
      className="w-full mt-4"
    >
      <Database className="h-4 w-4 mr-2" />
      تحميل بيانات تجريبية للاختبار
    </Button>
  );
}