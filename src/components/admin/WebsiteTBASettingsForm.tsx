import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';
import { Info, Copy, Check } from 'lucide-react';

const formSchema = z.object({
  tba_api_key: z.string().min(1, "TBA API Key is required").or(z.literal("")).optional(),
});

interface WebsiteTBASettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const SQL_MIGRATION_SNIPPET = `ALTER TABLE website_settings
ADD COLUMN IF NOT EXISTS tba_api_key TEXT;`;

const WebsiteTBASettingsForm: React.FC<WebsiteTBASettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('tba_api_key') : '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tba_api_key: initialData.tba_api_key || localKey || '',
    },
  });

  useEffect(() => {
    form.reset({
      tba_api_key: initialData.tba_api_key || localKey || '',
    });
  }, [initialData, form, localKey]);

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
              Your key is saved locally and will be used when syncing. To also store it permanently in Supabase, run this in your <strong>Supabase SQL Editor</strong>:
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
    </div>
  );
};

export default WebsiteTBASettingsForm;