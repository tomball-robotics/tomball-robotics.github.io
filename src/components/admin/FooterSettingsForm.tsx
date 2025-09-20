import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';

const footerSettingsFormSchema = z.object({
  footer_address: z.string().optional(),
  footer_email: z.string().email("Must be a valid email address").or(z.literal("")).optional(),
  facebook_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  instagram_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  youtube_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  x_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

interface FooterSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const FooterSettingsForm: React.FC<FooterSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof footerSettingsFormSchema>>({
    resolver: zodResolver(footerSettingsFormSchema),
    defaultValues: {
      footer_address: initialData?.footer_address || '',
      footer_email: initialData?.footer_email || '',
      facebook_url: initialData?.facebook_url || '',
      instagram_url: initialData?.instagram_url || '',
      youtube_url: initialData?.youtube_url || '',
      x_url: initialData?.x_url || '',
    },
  });

  useEffect(() => {
    form.reset({
      footer_address: initialData.footer_address || '',
      footer_email: initialData.footer_email || '',
      facebook_url: initialData.facebook_url || '',
      instagram_url: initialData.instagram_url || '',
      youtube_url: initialData.youtube_url || '',
      x_url: initialData.x_url || '',
    });
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof footerSettingsFormSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4">Contact Information</h3>
        <FormField
          control={form.control}
          name="footer_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter full address" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="footer_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter contact email" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4 mt-8">Social Media Links</h3>
        <FormField
          control={form.control}
          name="facebook_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.facebook.com/yourpage" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagram_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.instagram.com/yourpage" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="youtube_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.youtube.com/yourchannel" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="x_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>X (Twitter) URL</FormLabel>
              <FormControl>
                <Input placeholder="https://twitter.com/yourhandle" {...field} disabled={isLoading} />
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

export default FooterSettingsForm;