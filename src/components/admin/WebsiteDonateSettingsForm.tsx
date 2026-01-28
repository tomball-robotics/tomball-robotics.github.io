import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';

const formSchema = z.object({
  donate_button_text: z.string().min(1, "Donate button text is required").optional(),
  donate_button_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

interface WebsiteDonateSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteDonateSettingsForm: React.FC<WebsiteDonateSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donate_button_text: initialData.donate_button_text || '',
      donate_button_url: initialData.donate_button_url || '',
    },
  });

  useEffect(() => {
    form.reset({
      donate_button_text: initialData.donate_button_text || '',
      donate_button_url: initialData.donate_button_url || '',
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
          name="donate_button_text"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Donate Button Text</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Donate to Tomball Robotics with PayPal" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="donate_button_url"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Donate Button URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="e.g., https://www.paypal.com/your-donation-link" {...field} disabled={isLoading} />
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

export default WebsiteDonateSettingsForm;