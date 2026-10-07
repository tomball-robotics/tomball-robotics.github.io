import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';
import { ExternalLink, HeartHandshake } from 'lucide-react';

const formSchema = z.object({
  donate_button_text: z.string().min(1, "Donate button text is required"),
  donate_button_url: z.string().url("Must be a valid URL"),
});

interface WebsiteDonateSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteDonateSettingsForm: React.FC<WebsiteDonateSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const localText = typeof window !== 'undefined' ? localStorage.getItem('donate_button_text') : '';
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('donate_button_url') : '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donate_button_text: initialData.donate_button_text || localText || 'Donate to Tomball Robotics with PayPal',
      donate_button_url: initialData.donate_button_url || localUrl || 'https://www.paypal.com/ncp/payment/WRGGJGFCNSYTA',
    },
  });

  useEffect(() => {
    form.reset({
      donate_button_text: initialData.donate_button_text || localText || 'Donate to Tomball Robotics with PayPal',
      donate_button_url: initialData.donate_button_url || localUrl || 'https://www.paypal.com/ncp/payment/WRGGJGFCNSYTA',
    });
  }, [initialData, form, localText, localUrl]);

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  const previewUrl = form.watch('donate_button_url');
  const previewText = form.watch('donate_button_text');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <HeartHandshake className="h-7 w-7 text-[#d92507]" />
        <div>
          <h3 className="text-xl font-bold text-[#0d2f60]">Donate Page Call-to-Action</h3>
          <p className="text-sm text-gray-600">Customize the donation button and destination link displayed on the /donate page.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
          <FormField
            control={form.control}
            name="donate_button_text"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-semibold text-gray-800">Donate Button Text</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Donate to Tomball Robotics with PayPal" {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>The label displayed on the main donation button.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="donate_button_url"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-semibold text-gray-800">Donate Button URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="e.g., https://www.paypal.com/ncp/payment/..." {...field} disabled={isLoading} />
                </FormControl>
                <FormDescription>The link users will be redirected to when clicking the button.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {previewUrl && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Preview</p>
                <p className="font-medium text-gray-800 mt-1">{previewText || "Donate Button"}</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                  Test Link <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="bg-[#d92507] hover:bg-[#b31f06]">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WebsiteDonateSettingsForm;