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
import { XCircle } from 'lucide-react'; // For remove button icon

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

  // Refs for file inputs to clear their value after upload
  const fileInputRefs = {
    hero_background_image: useRef<HTMLInputElement>(null),
    about_preview_image_url: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof WebsiteSettings) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = showLoading(`Uploading ${fieldName.replace(/_/g, ' ')}...`);
    
    let subfolder = '';
    if (fieldName === 'hero_background_image') {
      subfolder = 'hero_background';
    } else if (fieldName === 'about_preview_image_url') {
      subfolder = 'about_preview';
    } else {
      console.error(`Unexpected fieldName for image upload: ${fieldName}`);
      dismissToast(toastId);
      showError('Invalid image field for upload.');
      return;
    }

    const filePath = `website_settings/${subfolder}/${file.name}`;
    const publicUrl = await uploadFile('website-images', filePath, file);

    dismissToast(toastId);
    if (publicUrl) {
      form.setValue(fieldName as any, publicUrl, { shouldValidate: true });
      showSuccess(`${fieldName.replace(/_/g, ' ')} uploaded successfully!`);
    } else {
      showError(`Failed to upload ${fieldName.replace(/_/g, ' ')}.`);
    }
    // Clear the file input value so the same file can be selected again
    if (fileInputRefs[fieldName as 'hero_background_image' | 'about_preview_image_url'].current) {
      fileInputRefs[fieldName as 'hero_background_image' | 'about_preview_image_url'].current!.value = '';
    }
  };

  const handleRemoveImage = async (fieldName: keyof WebsiteSettings) => {
    const currentUrl = form.getValues(fieldName as any);
    if (!currentUrl) return;

    const confirmRemove = window.confirm("Are you sure you want to remove this image? This will also delete it from Supabase Storage.");
    if (!confirmRemove) return;

    const toastId = showLoading(`Removing ${fieldName.replace(/_/g, ' ')}...`);

    // Extract file path from Supabase public URL
    const pathSegments = currentUrl.split('/public/website-images/');
    if (pathSegments.length > 1) {
      const filePathInBucket = pathSegments[1];
      const success = await deleteFile('website-images', filePathInBucket);

      if (success) {
        form.setValue(fieldName as any, '', { shouldValidate: true });
        showSuccess(`${fieldName.replace(/_/g, ' ')} removed successfully!`);
      } else {
        showError(`Failed to remove ${fieldName.replace(/_/g, ' ')} from storage.`);
      }
    } else {
      // If it's not a Supabase URL, just clear the field
      form.setValue(fieldName as any, '', { shouldValidate: true });
      showSuccess(`${fieldName.replace(/_/g, ' ')} URL cleared.`);
    }
    dismissToast(toastId);
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  const renderImageField = (fieldName: keyof WebsiteSettings, label: string) => (
    <FormField
      control={form.control}
      name={fieldName as any}
      render={({ field }) => (
        <FormItem className="space-y-2"> {/* Added space-y-2 for consistent spacing */}
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {field.value && (
                <div className="relative w-48 h-32 rounded-md overflow-hidden border border-gray-200">
                  <img src={field.value} alt={label} className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveImage(fieldName)}
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              )}
              <Input
                type="file"
                ref={fileInputRefs[fieldName as 'hero_background_image' | 'about_preview_image_url']}
                onChange={(e) => handleFileUpload(e, fieldName)}
                className="cursor-pointer"
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
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4">Hero Section</h3>
        <FormField
          control={form.control}
          name="hero_title"
          render={({ field }) => (
            <FormItem className="space-y-2"> {/* Added space-y-2 */}
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
            <FormItem className="space-y-2"> {/* Added space-y-2 */}
              <FormLabel>Hero Subtitle</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter hero subtitle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {renderImageField('hero_background_image', 'Hero Background Image')}

        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4 mt-8">About Section Preview</h3>
        <FormField
          control={form.control}
          name="about_preview_title"
          render={({ field }) => (
            <FormItem className="space-y-2"> {/* Added space-y-2 */}
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
            <FormItem className="space-y-2"> {/* Added space-y-2 */}
              <FormLabel>About Preview Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter about preview description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {renderImageField('about_preview_image_url', 'About Preview Image')}

        <h3 className="text-2xl font-bold text-[#0d2f60] mb-4 mt-8">Events Section Preview</h3>
        <FormField
          control={form.control}
          name="events_preview_title"
          render={({ field }) => (
            <FormItem className="space-y-2"> {/* Added space-y-2 */}
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
            <FormItem className="space-y-2"> {/* Added space-y-2 */}
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
            <FormItem className="space-y-2"> {/* Added space-y-2 */}
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
            <FormItem className="space-y-2"> {/* Added space-y-2 */}
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