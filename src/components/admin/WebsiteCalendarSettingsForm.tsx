import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';

const formSchema = z.object({
  calendar_embed_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

interface WebsiteCalendarSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteCalendarSettingsForm: React.FC<WebsiteCalendarSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendar_embed_url: initialData.calendar_embed_url || '',
    },
  });

  useEffect(() => {
    form.reset({
      calendar_embed_url: initialData.calendar_embed_url || '',
    });
  }, [initialData, form]);

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    console.log('[WebsiteCalendarSettingsForm] Submitting values:', values);
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="calendar_embed_url"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Google Calendar Embed URL</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste ONLY the 'src' URL from your Google Calendar embed iframe here (e.g., https://calendar.google.com/calendar/embed?src=...)"
                  {...field}
                  disabled={isLoading}
                  rows={5}
                />
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

export default WebsiteCalendarSettingsForm;