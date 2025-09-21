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
  events_preview_title: z.string().min(1, "Events preview title is required"),
  events_preview_description: z.string().min(1, "Events preview description is required"),
});

interface WebsiteEventsPreviewSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteEventsPreviewSettingsForm: React.FC<WebsiteEventsPreviewSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      events_preview_title: initialData.events_preview_title,
      events_preview_description: initialData.events_preview_description,
    },
  });

  useEffect(() => {
    form.reset({
      events_preview_title: initialData.events_preview_title,
      events_preview_description: initialData.events_preview_description,
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
          name="events_preview_title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Events Preview Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter events preview title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="events_preview_description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Events Preview Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter events preview description" {...field} disabled={isLoading} />
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

export default WebsiteEventsPreviewSettingsForm;