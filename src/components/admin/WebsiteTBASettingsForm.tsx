import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';

const formSchema = z.object({
  tba_api_key: z.string().min(1, "TBA API Key is required").or(z.literal("")).optional(),
});

interface WebsiteTBASettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteTBASettingsForm: React.FC<WebsiteTBASettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tba_api_key: initialData.tba_api_key || '',
    },
  });

  useEffect(() => {
    form.reset({
      tba_api_key: initialData.tba_api_key || '',
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
          name="tba_api_key"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>The Blue Alliance API Key</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Paste your TBA Read API Key here" 
                  {...field} 
                  disabled={isLoading} 
                />
              </FormControl>
              <FormDescription>
                You can get this key from your account page on <a href="https://www.thebluealliance.com/account" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">The Blue Alliance</a>.
              </FormDescription>
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

export default WebsiteTBASettingsForm;