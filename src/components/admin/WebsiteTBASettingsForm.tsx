import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';
import { Key, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const formSchema = z.object({
  tba_api_key: z.string().min(1, "TBA API Key is required"),
});

interface WebsiteTBASettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteTBASettingsForm: React.FC<WebsiteTBASettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

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

  const handleTestKey = async () => {
    const key = form.getValues('tba_api_key');
    if (!key || key.trim() === '') {
      showError('Please enter a key before testing.');
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('https://www.thebluealliance.com/api/v3/team/frc7312', {
        headers: { 'X-TBA-Auth-Key': key.trim() },
      });

      if (res.ok) {
        const teamData = await res.json();
        setTestResult('success');
        showSuccess(`Connected successfully to TBA! Team: ${teamData.nickname || 'Team 7312'}`);
      } else if (res.status === 401) {
        setTestResult('error');
        showError('Invalid API Key. Please verify the key from your The Blue Alliance account.');
      } else {
        setTestResult('error');
        showError(`TBA responded with status: ${res.status}`);
      }
    } catch (err: any) {
      setTestResult('error');
      showError('Failed to reach The Blue Alliance API. Check network connection.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <Key className="h-7 w-7 text-[#0d2f60]" />
        <div>
          <h3 className="text-xl font-bold text-[#0d2f60]">The Blue Alliance (TBA) Integration</h3>
          <p className="text-sm text-gray-600">Enter your Read API key to automatically fetch Team 7312 match outcomes, awards, and rank information.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
          <FormField
            control={form.control}
            name="tba_api_key"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-semibold text-gray-800">The Blue Alliance API Key</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Paste your TBA Read API Key here" 
                      {...field} 
                      disabled={isLoading || testing} 
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestKey}
                    disabled={testing || isLoading}
                    className="flex-shrink-0"
                  >
                    {testing ? (
                      <>
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Testing...
                      </>
                    ) : (
                      'Test Key'
                    )}
                  </Button>
                </div>
                <FormDescription>
                  Obtain your key anytime under Account Settings at{' '}
                  <a href="https://www.thebluealliance.com/account" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    thebluealliance.com/account
                  </a>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {testResult === 'success' && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Key validated! Successfully connected to The Blue Alliance API.</span>
            </div>
          )}

          {testResult === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span>Validation failed. Ensure you copied the "Read API Key" without extra whitespace.</span>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="bg-[#d92507] hover:bg-[#b31f06]">
            {isLoading ? 'Saving...' : 'Save TBA Key'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WebsiteTBASettingsForm;