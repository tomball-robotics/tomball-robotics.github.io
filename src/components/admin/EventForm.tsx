import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Event } from '@/types/supabase';
import ArrayInputField from './ArrayInputField';

const eventFormSchema = z.object({
  id: z.string().min(1, "Event ID is required"),
  name: z.string().min(1, "Event name is required"),
  location: z.string().min(1, "Location is required"),
  event_date: z.string().min(1, "Event date is required"),
  awards: z.array(z.string()).optional(),
  qual_rank: z.coerce.number().int().min(0).optional().nullable(),
  playoff_status: z.string().optional().nullable(),
  alliance_status: z.string().optional().nullable(),
  overall_status_str: z.string().optional().nullable(),
  record_wins: z.coerce.number().int().min(0).optional().nullable(),
  record_losses: z.coerce.number().int().min(0).optional().nullable(),
  record_ties: z.coerce.number().int().min(0).optional().nullable(),
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
      id: initialData?.id || '',
      name: initialData?.name || '',
      location: initialData?.location || '',
      event_date: initialData?.event_date ? new Date(initialData.event_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      awards: initialData?.awards || [],
      qual_rank: initialData?.qual_rank || null,
      playoff_status: initialData?.playoff_status || null,
      alliance_status: initialData?.alliance_status || null,
      overall_status_str: initialData?.overall_status_str || null,
      record_wins: initialData?.record_wins || null,
      record_losses: initialData?.record_losses || null,
      record_ties: initialData?.record_ties || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        name: initialData.name,
        location: initialData.location,
        event_date: new Date(initialData.event_date).toISOString().split('T')[0],
        awards: initialData.awards || [],
        qual_rank: initialData.qual_rank,
        playoff_status: initialData.playoff_status,
        alliance_status: initialData.alliance_status,
        overall_status_str: initialData.overall_status_str,
        record_wins: initialData.record_wins,
        record_losses: initialData.record_losses,
        record_ties: initialData.record_ties,
      });
    } else {
      form.reset({
        id: '',
        name: '',
        location: '',
        event_date: new Date().toISOString().split('T')[0],
        awards: [],
        qual_rank: null,
        playoff_status: null,
        alliance_status: null,
        overall_status_str: null,
        record_wins: null,
        record_losses: null,
        record_ties: null,
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
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event ID (from TBA)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2023txcmp" {...field} disabled={isLoading || !!initialData?.id} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter event location" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="event_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ArrayInputField form={form} name="awards" label="Awards" placeholder="e.g., Regional Winner" />
        
        <h3 className="text-xl font-bold text-[#0d2f60] mt-8 mb-4">Team Status at Event</h3>
        <FormField
          control={form.control}
          name="overall_status_str"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overall Status String</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Rank 5, Eliminated in Semifinals" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qual_rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Qualification Rank</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 20" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="record_wins"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Record Wins</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 4" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="record_losses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Record Losses</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 5" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="record_ties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Record Ties</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 0" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alliance_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alliance Status</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Captain, 1st Pick" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="playoff_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playoff Status</FormLabel>
              <FormControl>
                <Input placeholder="e.g., eliminated in quarterfinals" {...field} disabled={isLoading} />
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

export default EventForm;