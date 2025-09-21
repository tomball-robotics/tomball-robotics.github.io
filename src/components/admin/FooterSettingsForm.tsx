import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteSettings, SocialMediaLink } from '@/types/supabase';
import SocialMediaInputField from './SocialMediaInputField'; // Import the new component

const footerSettingsFormSchema = z.object({
  footer_address: z.string().optional(),
  footer_email: z.string().email("Must be a valid email address").or(z.literal("")).optional(),
  social_media_links: z.array(z.object({
    type: z.enum(['facebook', 'instagram', 'youtube', 'x', 'linkedin', 'github', 'website', 'custom']),
    url: z.string().url("Must be a valid URL"),
  })).optional(),
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
      social_media_links: initialData?.social_media_links || [],
    },
  });

  useEffect(() => {
    form.reset({
      footer_address: initialData.footer_address || '',
      footer_email: initialData.footer_email || '',
      social_media_links: initialData.social_media_links || [],
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
        <SocialMediaInputField form={form} name="social_media_links" label="Social Media Links" />

        <Button type="submit" disabled={isLoading} className="bg-[#d92507] hover:bg-[#b31f06]">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default FooterSettingsForm;