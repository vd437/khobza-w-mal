import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useExpense } from "@/contexts/ExpenseContext";
import { CURRENCIES } from "@/types/expense";
import { Settings, Download, Upload, Copy, Eye, EyeOff, Moon, Sun } from "lucide-react";

export function SettingsPanel() {
  const { state, updateSettings, exportData, importData } = useExpense();
  const { settings } = state;
  const { toast } = useToast();
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleImport = async () => {
    if (!importFile) return;

    try {
      await importData(importFile);
      toast({
        title: "تم الاستيراد بنجاح",
        description: "تم استيراد البيانات بنجاح",
      });
      setImportFile(null);
    } catch (error) {
      toast({
        title: "خطأ في الاستيراد",
        description: "حدث خطأ أثناء استيراد البيانات",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    exportData();
    toast({
      title: "تم التصدير بنجاح",
      description: "تم تصدير البيانات إلى ملف JSON",
    });
  };

  const copyToClipboard = async () => {
    try {
      const data = {
        transactions: state.transactions,
        settings: state.settings,
        exportDate: new Date().toISOString(),
      };
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast({
        title: "تم النسخ",
        description: "تم نسخ البيانات إلى الحافظة",
      });
    } catch (error) {
      toast({
        title: "خطأ في النسخ",
        description: "لم يتم نسخ البيانات",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* إعدادات العرض */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إعدادات العرض
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">العملة</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) => updateSettings({ currency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر العملة" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.symbol}</span>
                      {currency.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="flex items-center gap-2">
                {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                الوضع المظلم
              </Label>
              <p className="text-sm text-muted-foreground">
                تبديل بين الوضع الفاتح والمظلم
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => {
                updateSettings({ darkMode: checked });
                document.documentElement.classList.toggle('dark', checked);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="hide-amounts" className="flex items-center gap-2">
                {settings.hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                إخفاء المبالغ
              </Label>
              <p className="text-sm text-muted-foreground">
                إخفاء المبالغ المالية للخصوصية
              </p>
            </div>
            <Switch
              id="hide-amounts"
              checked={settings.hideAmounts}
              onCheckedChange={(checked) => updateSettings({ hideAmounts: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="budget-alerts">تنبيهات الميزانية</Label>
              <p className="text-sm text-muted-foreground">
                تلقي تنبيهات عند تجاوز الميزانية
              </p>
            </div>
            <Switch
              id="budget-alerts"
              checked={settings.budgetAlerts}
              onCheckedChange={(checked) => updateSettings({ budgetAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* إدارة البيانات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            إدارة البيانات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>تصدير البيانات</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                تصدير JSON
              </Button>
              <Button
                variant="outline"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              تصدير جميع البيانات إلى ملف JSON أو نسخها إلى الحافظة
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="import-file">استيراد البيانات</Label>
            <div className="flex gap-2">
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
              <Button
                onClick={handleImport}
                disabled={!importFile}
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                استيراد
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              استيراد البيانات من ملف JSON (سيتم استبدال البيانات الحالية)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* معلومات التطبيق */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات التطبيق</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">
            <p><strong>الإصدار:</strong> 1.0.0</p>
            <p><strong>عدد المعاملات:</strong> {state.transactions.length}</p>
            <p><strong>تاريخ آخر نسخة احتياطية:</strong> {
              localStorage.getItem('expense-transactions') ? 'محفوظة محلياً' : 'غير متوفرة'
            }</p>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              تطبيق إدارة المصاريف الشخصية - جميع البيانات محفوظة محلياً في متصفحك
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}