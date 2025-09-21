import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

const formSchema = z.object({
  sponsors_preview_title: z.string().min(1, "Sponsors preview title is required"),
  sponsors_preview_description: z.string().min(1, "Sponsors preview description is required"),
});

interface WebsiteSponsorsPreviewSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteSponsorsPreviewSettingsForm: React.FC<WebsiteSponsorsPreviewSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sponsors_preview_title: initialData.sponsors_preview_title,
      sponsors_preview_description: initialData.sponsors_preview_description,
    },
  });

  useEffect(() => {
    form.reset({
      sponsors_preview_title: initialData.sponsors_preview_title,
      sponsors_preview_description: initialData.sponsors_preview_description,
    });
  }, [initialData, form]);

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="sponsors_preview_title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Sponsors Preview Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter sponsors preview title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sponsors_preview_description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Sponsors Preview Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter sponsors preview description" {...field} disabled={isLoading} />
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

export default WebsiteSponsorsPreviewSettingsForm;