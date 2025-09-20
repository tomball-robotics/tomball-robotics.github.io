import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';
import { uploadFile } from '@/integrations/supabase/storage';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

const formSchema = z.object({
  hero_title: z.string().min(1, "Hero title is required"),
  hero_subtitle: z.string().min(1, "Hero subtitle is required"),
  hero_background_image: z.string().url("Must be a valid URL or upload an image").or(z.literal("")),
  about_preview_title: z.string().min(1, "About preview title is required"),
  about_preview_description: z.string().min(1, "About preview description is required"),
  about_preview_image_url: z.string().url("Must be a valid URL or upload an image").or(z.literal("")),
  events_preview_title: z.string().min(1, "Events preview title is required"),
  events_preview_description: z.string().min(1, "Events preview description is required"),
  sponsors_preview_title: z.string().min(1, "Sponsors preview title is required"),
  sponsors_preview_description: z.string().min(1, "Sponsors preview description is required"),
});

interface WebsiteSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteSettingsForm: React.FC<WebsiteSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof WebsiteSettings) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = showLoading(`Uploading ${fieldName.replace(/_/g, ' ')}...`);
    const filePath = `website_settings/${fieldName}/${file.name}`;
    const publicUrl = await uploadFile('website-images', filePath, file);

    dismissToast(toastId);
    if (publicUrl) {
      form.setValue(fieldName as any, publicUrl, { shouldValidate: true });
      showSuccess(`${fieldName.replace(/_/g, ' ')} uploaded successfully!`);
    } else {
      showError(`Failed to upload ${fieldName.replace(/_/g, ' ')}.`);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4">Hero Section</h3>
        <FormField
          control={form.control}
          name="hero_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter hero title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hero_subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Subtitle</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter hero subtitle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hero_background_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Background Image URL</FormLabel>
              <FormControl>
                <>
                  <Input type="file" onChange={(e) => handleFileChange(e, 'hero_background_image')} />
                  {field.value && <img src={field.value} alt="Hero Background" className="mt-2 h-32 object-cover rounded-md" />}
                  <Input placeholder="Or enter image URL" {...field} className="mt-2" />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4 mt-8">About Section Preview</h3>
        <FormField
          control={form.control}
          name="about_preview_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Preview Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter about preview title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about_preview_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Preview Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter about preview description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about_preview_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Preview Image URL</FormLabel>
              <FormControl>
                <>
                  <Input type="file" onChange={(e) => handleFileChange(e, 'about_preview_image_url')} />
                  {field.value && <img src={field.value} alt="About Preview" className="mt-2 h-32 object-cover rounded-md" />}
                  <Input placeholder="Or enter image URL" {...field} className="mt-2" />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4 mt-8">Events Section Preview</h3>
        <FormField
          control={form.control}
          name="events_preview_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Events Preview Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter events preview title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="events_preview_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Events Preview Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter events preview description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4 mt-8">Sponsors Section Preview</h3>
        <FormField
          control={form.control}
          name="sponsors_preview_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sponsors Preview Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter sponsors preview title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sponsors_preview_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sponsors Preview Description</FormLabel>
            <FormControl>
                <Textarea placeholder="Enter sponsors preview description" {...field} />
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

export default WebsiteSettingsForm;