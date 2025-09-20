import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Sponsor } from '@/types/supabase';
import ImageUploadField from './ImageUploadField'; // Reusable component for image uploads
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select components

const sponsorFormSchema = z.object({
  name: z.string().min(1, "Sponsor name is required"),
  image_url: z.string().url("Must be a valid URL or upload an image").or(z.literal("")).optional(),
  description: z.string().optional(),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  notes: z.string().optional(),
  website_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  image_fit: z.enum(['contain', 'cover']).default('contain'), // New field for image fit
});

interface SponsorFormProps {
  initialData?: Sponsor;
  onSubmit: (data: Partial<Sponsor>) => Promise<void>;
  isLoading: boolean;
}

const SponsorForm: React.FC<SponsorFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof sponsorFormSchema>>({
    resolver: zodResolver(sponsorFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      image_url: initialData?.image_url || '',
      description: initialData?.description || '',
      amount: initialData?.amount || 0,
      notes: initialData?.notes || '',
      website_url: initialData?.website_url || '',
      image_fit: initialData?.image_fit || 'contain', // Default value for new field
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        image_url: initialData.image_url || '',
        description: initialData.description || '',
        amount: initialData.amount,
        notes: initialData.notes || '',
        website_url: initialData.website_url || '',
        image_fit: initialData.image_fit || 'contain',
      });
    } else {
      form.reset({
        name: '',
        image_url: '',
        description: '',
        amount: 0,
        notes: '',
        website_url: '',
        image_fit: 'contain',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof sponsorFormSchema>) => {
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
              <FormLabel>Sponsor Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter sponsor name" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUploadField
          form={form}
          name="image_url"
          label="Sponsor Logo"
          bucketName="website-images"
          folderPath="sponsors"
        />
        <FormField
          control={form.control}
          name="image_fit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Fit</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select how the image should fit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contain">Fit (show entire logo)</SelectItem>
                  <SelectItem value="cover">Fill (cover entire area, may crop)</SelectItem>
                </SelectContent>
              </Select>
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
                <Textarea placeholder="Enter description" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sponsorship Amount ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter amount" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter any notes (e.g., 'Donated services')" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.sponsorwebsite.com" {...field} disabled={isLoading} />
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

export default SponsorForm;