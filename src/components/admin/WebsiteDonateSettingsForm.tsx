import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';
import { Info, Copy, Check } from 'lucide-react';

const formSchema = z.object({
  donate_button_text: z.string().min(1, "Donate button text is required").optional(),
  donate_button_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

interface WebsiteDonateSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const SQL_MIGRATION_SNIPPET = `ALTER TABLE website_settings
ADD COLUMN IF NOT EXISTS donate_button_text TEXT,
ADD COLUMN IF NOT EXISTS donate_button_url TEXT,
ADD COLUMN IF NOT EXISTS tba_api_key TEXT;`;

const WebsiteDonateSettingsForm: React.FC<WebsiteDonateSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [copied, setCopied] = useState(false);

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

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-semibold">Database Schema Notice:</p>
            <p>
              Your changes are automatically saved and will take effect immediately. To also store them in your Supabase database permanently, run this quick SQL statement in your <strong>Supabase Dashboard > SQL Editor</strong>:
            </p>
            <div className="relative bg-slate-900 text-slate-100 font-mono text-xs p-3 rounded mt-2 overflow-x-auto">
              <pre>{SQL_MIGRATION_SNIPPET}</pre>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopySQL}
                className="absolute top-2 right-2 h-7 px-2 text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? 'Copied' : 'Copy SQL'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
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
                  <Input type="url" placeholder="e.g., https://www.paypal.com/ncp/payment/..." {...field} disabled={isLoading} />
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
    </div>
  );
};

export default WebsiteDonateSettingsForm;