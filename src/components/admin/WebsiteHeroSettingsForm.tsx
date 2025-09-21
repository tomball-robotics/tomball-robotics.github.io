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
  hero_title: z.string().min(1, "Hero title is required"),
  hero_subtitle: z.string().min(1, "Hero subtitle is required"),
  hero_background_image: z.string().url("Must be a valid URL or upload an image").or(z.literal("")),
});

interface WebsiteHeroSettingsFormProps {
  initialData: WebsiteSettings;
  onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>;
  isLoading: boolean;
}

const WebsiteHeroSettingsForm: React.FC<WebsiteHeroSettingsFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hero_title: initialData.hero_title,
      hero_subtitle: initialData.hero_subtitle,
      hero_background_image: initialData.hero_background_image,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    form.reset({
      hero_title: initialData.hero_title,
      hero_subtitle: initialData.hero_subtitle,
      hero_background_image: initialData.hero_background_image,
    });
  }, [initialData, form]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = showLoading('Uploading hero background image...');
    const filePath = `website_settings/hero_background/${file.name}`;
    const publicUrl = await uploadFile('website-images', filePath, file);

    dismissToast(toastId);
    if (publicUrl) {
      form.setValue('hero_background_image', publicUrl, { shouldValidate: true });
      showSuccess('Hero background image uploaded successfully!');
    } else {
      showError('Failed to upload hero background image.');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    const currentUrl = form.getValues('hero_background_image');
    if (!currentUrl) return;

    const confirmRemove = window.confirm("Are you sure you want to remove this image? This will also delete it from Supabase Storage.");
    if (!confirmRemove) return;

    const toastId = showLoading('Removing hero background image...');
    const pathSegments = currentUrl.split('/public/website-images/');
    if (pathSegments.length > 1) {
      const filePathInBucket = pathSegments[1];
      const success = await deleteFile('website-images', filePathInBucket);

      if (success) {
        form.setValue('hero_background_image', '', { shouldValidate: true });
        showSuccess('Hero background image removed successfully!');
      } else {
        showError('Failed to remove hero background image from storage.');
      }
    } else {
      form.setValue('hero_background_image', '', { shouldValidate: true });
      showSuccess('Hero background image URL cleared.');
    }
    dismissToast(toastId);
  };

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    console.log('WebsiteHeroSettingsForm: handleSubmitForm called. values:', values);
    await onSubmit(values);
    console.log('WebsiteHeroSettingsForm: onSubmit prop finished.');
  };

  console.log('WebsiteHeroSettingsForm render. isLoading prop:', isLoading);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="hero_title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Hero Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter hero title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hero_subtitle"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Hero Subtitle</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter hero subtitle" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hero_background_image"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Hero Background Image</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value && (
                    <div className="relative w-48 h-32 rounded-md overflow-hidden border border-gray-200">
                      <img src={field.value} alt="Hero Background" className="w-full h-full object-cover" />
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

export default WebsiteHeroSettingsForm;