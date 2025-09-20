import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Event } from '@/types/supabase';
import ArrayInputField from './ArrayInputField'; // Reusable component for array inputs

const eventFormSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  year: z.coerce.number().min(1900, "Year must be valid").max(2100, "Year must be valid"),
  location: z.string().min(1, "Location is required"),
  awards: z.array(z.string()).optional(),
});

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Partial<Event>) => Promise<void>;
  isLoading: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      year: initialData?.year || new Date().getFullYear(),
      location: initialData?.location || '',
      awards: initialData?.awards || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        year: initialData.year,
        location: initialData.location,
        awards: initialData.awards || [],
      });
    } else {
      form.reset({
        name: '',
        year: new Date().getFullYear(),
        location: '',
        awards: [],
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof eventFormSchema>) => {
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
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} disabled={isLoading} />
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
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ArrayInputField form={form} name="awards" label="Awards" placeholder="e.g., Impact Award" />

        <Button type="submit" disabled={isLoading} className="bg-[#d92507] hover:bg-[#b31f06]">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;