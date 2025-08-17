import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, TrendingUp, TrendingDown, UtensilsCrossed, Car, ShoppingBag, Zap, Heart, Film, GraduationCap, MoreHorizontal, Briefcase, Building2, Laptop, Gift, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useExpense } from "@/contexts/ExpenseContext";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types/expense";

const formSchema = z.object({
  amount: z.string().min(1, "المبلغ مطلوب").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "يجب أن يكون المبلغ رقمًا صحيحًا أكبر من 0"),
  type: z.enum(["income", "expense"], { message: "النوع مطلوب" }),
  category: z.string().min(1, "الفئة مطلوبة"),
  description: z.string().min(1, "الوصف مطلوب"),
  date: z.date({ message: "التاريخ مطلوب" }),
});

export function TransactionForm() {
  const { addTransaction } = useExpense();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      type: "expense",
      category: "",
      description: "",
      date: new Date(),
    },
  });

  const watchType = form.watch("type");
  const categories = watchType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
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
    return <IconComponent className="h-4 w-4" />;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addTransaction({
      amount: Number(values.amount),
      type: values.type,
      category: values.category,
      description: values.description,
      date: values.date,
    });

    form.reset({
      amount: "",
      type: "expense",
      category: "",
      description: "",
      date: new Date(),
    });
  };

  return (
    <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع المعاملة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="expense">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4 text-danger" />
                            مصروف
                          </div>
                        </SelectItem>
                        <SelectItem value="income">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-success" />
                            دخل
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            {renderCategoryIcon(category.icon)}
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="وصف المعاملة..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>التاريخ</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-right font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ar })
                          ) : (
                            <span>اختر التاريخ</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  form.reset({
                    amount: "",
                    type: "expense",
                    category: "",
                    description: "",
                    date: new Date(),
                  });
                }}
              >
                إعادة تعيين
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
              >
                حفظ المعاملة
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}