import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { WebsiteSettings } from '@/types/supabase';
import { uploadFile, deleteFile } from '@/integrations/supabase/storage';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { XCircle } from 'lucide-react';

const formSchema = z.object({
  about_preview_title: z.string().min(1, "About preview title is required"),
  about_preview_description: z.string().min(1, "About preview description is required"),
  about_preview_image_url: z.string().url("Must be a valid URL or upload an image").or(z.literal("")),
});

interface WebsiteAboutPreviewSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteAboutPreviewSettingsForm: React.FC<WebsiteAboutPreviewSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      about_preview_title: initialData.about_preview_title,
      about_preview_description: initialData.about_preview_description,
      about_preview_image_url: initialData.about_preview_image_url,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    form.reset({
      about_preview_title: initialData.about_preview_title,
      about_preview_description: initialData.about_preview_description,
      about_preview_image_url: initialData.about_preview_image_url,
    });
  }, [initialData, form]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = showLoading('Uploading about preview image...');
    const filePath = `website_settings/about_preview/${file.name}`;
    const publicUrl = await uploadFile('website-images', filePath, file);

    dismissToast(toastId);
    if (publicUrl) {
      form.setValue('about_preview_image_url', publicUrl, { shouldValidate: true });
      showSuccess('About preview image uploaded successfully!');
    } else {
      showError('Failed to upload about preview image.');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    const currentUrl = form.getValues('about_preview_image_url');
    if (!currentUrl) return;

    const confirmRemove = window.confirm("Are you sure you want to remove this image? This will also delete it from Supabase Storage.");
    if (!confirmRemove) return;

    const toastId = showLoading('Removing about preview image...');
    const pathSegments = currentUrl.split('/public/website-images/');
    if (pathSegments.length > 1) {
      const filePathInBucket = pathSegments[1];
      const success = await deleteFile('website-images', filePathInBucket);

      if (success) {
        form.setValue('about_preview_image_url', '', { shouldValidate: true });
        showSuccess('About preview image removed successfully!');
      } else {
        showError('Failed to remove about preview image from storage.');
      }
    } else {
      form.setValue('about_preview_image_url', '', { shouldValidate: true });
      showSuccess('About preview image URL cleared.');
    }
    dismissToast(toastId);
  };

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="about_preview_title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>About Preview Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter about preview title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about_preview_description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>About Preview Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter about preview description" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about_preview_image_url"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>About Preview Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value && (
                    <div className="relative w-48 h-32 rounded-md overflow-hidden border border-gray-200">
                      <img src={field.value} alt="About Preview" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  )}
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                    disabled={isLoading}
                  />
                  {field.value && (
                    <p className="text-sm text-gray-500 break-all mt-2">Current URL: {field.value}</p>
                  )}
                </div>
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

export default WebsiteAboutPreviewSettingsForm;