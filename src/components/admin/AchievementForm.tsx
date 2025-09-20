import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Achievement } from '@/types/supabase';

const achievementFormSchema = z.object({
  year: z.string().min(4, "Year must be 4 digits").max(4, "Year must be 4 digits"),
  description: z.string().min(1, "Description is required"),
});

interface AchievementFormProps {
  initialData?: Achievement;
  onSubmit: (data: Partial<Achievement>) => Promise<void>;
  isLoading: boolean;
}

const AchievementForm: React.FC<AchievementFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof achievementFormSchema>>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      year: initialData?.year || String(new Date().getFullYear()),
      description: initialData?.description || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        year: initialData.year,
        description: initialData.description,
      });
    } else {
      form.reset({
        year: String(new Date().getFullYear()),
        description: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof achievementFormSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input placeholder="Enter year (e.g., 2023)" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter achievement description" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="bg-[#d92507] hover:bg-[#b31f06]">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default AchievementForm;