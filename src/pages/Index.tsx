import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { Dashboard } from "@/components/Dashboard";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionsList } from "@/components/TransactionsList";
import { SettingsPanel } from "@/components/SettingsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Plus, List, Settings, Wallet } from "lucide-react";

function ExpenseApp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  مدير المصاريف
                </h1>
                <p className="text-sm text-muted-foreground">إدارة الأموال الشخصية</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              مرحباً بك في تطبيق إدارة المصاريف
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">الرئيسية</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">إضافة</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">المعاملات</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-primary">إضافة معاملة جديدة</CardTitle>
                </CardHeader>
                <CardContent>
                  <TransactionForm />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionsList />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <SettingsPanel />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>تطبيق إدارة المصاريف الشخصية - جميع البيانات محفوظة محلياً في متصفحك</p>
            <p className="mt-1">مطور بواسطة سارة ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // تطبيق الوضع المظلم من localStorage
    const savedSettings = localStorage.getItem('expense-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.darkMode) {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('خطأ في تحميل إعدادات الوضع المظلم:', error);
      }
    }
  }, []);

  return (
    <ExpenseProvider>
      <ExpenseApp />
    </ExpenseProvider>
  );
};

export default Index;
