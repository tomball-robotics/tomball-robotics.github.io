import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SlideshowImage } from '@/types/supabase';
import ImageUploadField from './ImageUploadField';

const slideshowImageFormSchema = z.object({
  image_url: z.string().url("Must be a valid URL or upload an image").min(1, "Image is required"),
  sort_order: z.coerce.number().min(0, "Sort order must be a non-negative number").optional(),
});

interface SlideshowImageFormProps {
  initialData?: SlideshowImage;
  onSubmit: (data: Partial<SlideshowImage>) => Promise<void>;
  isLoading: boolean;
}

const SlideshowImageForm: React.FC<SlideshowImageFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof slideshowImageFormSchema>>({
    resolver: zodResolver(slideshowImageFormSchema),
    defaultValues: {
      image_url: initialData?.image_url || '',
      sort_order: initialData?.sort_order || 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        image_url: initialData.image_url,
        sort_order: initialData.sort_order,
      });
    } else {
      form.reset({
        image_url: '',
        sort_order: 0,
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof slideshowImageFormSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <ImageUploadField
          form={form}
          name="image_url"
          label="Slideshow Image"
          bucketName="website-images"
          folderPath="slideshow_images"
        />
        <FormField
          control={form.control}
          name="sort_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sort Order</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter sort order (lower numbers appear first)" {...field} disabled={isLoading} />
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

export default SlideshowImageForm;