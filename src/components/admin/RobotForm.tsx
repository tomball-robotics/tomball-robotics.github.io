import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Robot } from '@/types/supabase';
import ImageUploadField from './ImageUploadField'; // Reusable component for image uploads

const robotFormSchema = z.object({
  name: z.string().min(1, "Robot name is required"),
  year: z.coerce.number().min(1900, "Year must be valid").max(2100, "Year must be valid"),
  image_url: z.string().url("Must be a valid URL or upload an image").or(z.literal("")).optional(),
  specs: z.string().optional(),
  awards: z.string().optional(), // Stored as a single text string
});

interface RobotFormProps {
  initialData?: Robot;
  onSubmit: (data: Partial<Robot>) => Promise<void>;
  isLoading: boolean;
}

const RobotForm: React.FC<RobotFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof robotFormSchema>>({
    resolver: zodResolver(robotFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      year: initialData?.year || new Date().getFullYear(),
      image_url: initialData?.image_url || '',
      specs: initialData?.specs || '',
      awards: initialData?.awards || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        year: initialData.year,
        image_url: initialData.image_url || '',
        specs: initialData.specs || '',
        awards: initialData.awards || '',
      });
    } else {
      form.reset({
        name: '',
        year: new Date().getFullYear(),
        image_url: '',
        specs: '',
        awards: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof robotFormSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Robot Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter robot name" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter year" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUploadField
          form={form}
          name="image_url"
          label="Robot Image"
          bucketName="website-images"
          folderPath="robots"
        />
        <FormField
          control={form.control}
          name="specs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specifications</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter robot specifications" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="awards"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Awards (comma-separated)</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter awards (e.g., Regional Winner, Innovation in Control)" {...field} disabled={isLoading} />
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

export default RobotForm;