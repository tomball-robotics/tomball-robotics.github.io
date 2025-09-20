import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SponsorshipTier } from '@/types/supabase';
import ArrayInputField from './ArrayInputField'; // Reusable component for array inputs

const sponsorshipTierFormSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  price: z.string().min(1, "Price is required (e.g., '$500', '$10,000')"),
  benefits: z.array(z.string()).optional(),
  color: z.string().min(1, "Color is required (e.g., 'text-blue-500')"),
  tier_id: z.string().min(1, "Tier ID is required (e.g., 'diamond', 'gold')"),
});

interface SponsorshipTierFormProps {
  initialData?: SponsorshipTier;
  onSubmit: (data: Partial<SponsorshipTier>) => Promise<void>;
  isLoading: boolean;
}

const SponsorshipTierForm: React.FC<SponsorshipTierFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof sponsorshipTierFormSchema>>({
    resolver: zodResolver(sponsorshipTierFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || '',
      benefits: initialData?.benefits || [],
      color: initialData?.color || '',
      tier_id: initialData?.tier_id || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        price: initialData.price,
        benefits: initialData.benefits || [],
        color: initialData.color,
        tier_id: initialData.tier_id,
      });
    } else {
      form.reset({
        name: '',
        price: '',
        benefits: [],
        color: '',
        tier_id: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof sponsorshipTierFormSchema>) => {
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
              <FormLabel>Tier Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter tier name (e.g., Diamond, Gold)" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tier_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier ID (for internal use)</FormLabel>
              <FormControl>
                <Input placeholder="Enter unique tier ID (e.g., diamond, gold)" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Enter price (e.g., $50,000)" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ArrayInputField form={form} name="benefits" label="Benefits" placeholder="e.g., Logo on Competition Robot" />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Color (Tailwind class)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., text-cyan-400, text-yellow-500" {...field} disabled={isLoading} />
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

export default SponsorshipTierForm;