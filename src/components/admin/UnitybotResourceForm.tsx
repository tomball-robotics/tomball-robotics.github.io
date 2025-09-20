import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UnitybotResource } from '@/types/supabase';
import ImageUploadField from './ImageUploadField';
import LinkArrayInputField from './LinkArrayInputField';

const unitybotResourceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().url("Must be a valid URL or upload an image").or(z.literal("")).optional(),
  links: z.array(z.object({
    text: z.string().min(1, "Link text is required"),
    url: z.string().url("Must be a valid URL"),
  })).min(1, "At least one link is required"),
});

interface UnitybotResourceFormProps {
  initialData?: UnitybotResource;
  onSubmit: (data: Partial<UnitybotResource>) => Promise<void>;
  isLoading: boolean;
}

const UnitybotResourceForm: React.FC<UnitybotResourceFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof unitybotResourceFormSchema>>({
    resolver: zodResolver(unitybotResourceFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      image_url: initialData?.image_url || '',
      links: initialData?.links && initialData.links.length > 0 ? initialData.links : [{ text: '', url: '' }],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        image_url: initialData.image_url || '',
        links: initialData.links && initialData.links.length > 0 ? initialData.links : [{ text: '', url: '' }],
      });
    } else {
      form.reset({
        title: '',
        description: '',
        image_url: '',
        links: [{ text: '', url: '' }],
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof unitybotResourceFormSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter resource title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter resource description" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUploadField
          form={form}
          name="image_url"
          label="Image"
          bucketName="website-images"
          folderPath="unitybot_resources"
        />
        <LinkArrayInputField form={form} name="links" label="Links" />

        <Button type="submit" disabled={isLoading} className="bg-[#d92507] hover:bg-[#b31f06]">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default UnitybotResourceForm;