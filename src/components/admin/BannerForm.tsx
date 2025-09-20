import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Banner } from '@/types/supabase';

const bannerFormSchema = z.object({
  year: z.string().min(4, "Year must be 4 digits").max(4, "Year must be 4 digits"),
  text: z.string().min(1, "Banner text is required"),
});

interface BannerFormProps {
  initialData?: Banner;
  onSubmit: (data: Partial<Banner>) => Promise<void>;
  isLoading: boolean;
}

const BannerForm: React.FC<BannerFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      year: initialData?.year || String(new Date().getFullYear()),
      text: initialData?.text || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        year: initialData.year,
        text: initialData.text,
      });
    } else {
      form.reset({
        year: String(new Date().getFullYear()),
        text: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof bannerFormSchema>) => {
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
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner Text</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter banner text (e.g., Regional Winner)" {...field} disabled={isLoading} />
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

export default BannerForm;