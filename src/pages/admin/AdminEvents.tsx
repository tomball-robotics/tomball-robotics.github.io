import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EventForm from '@/components/admin/EventForm';
import { DataTable } from '@/components/admin/DataTable';
import Spinner from '@/components/Spinner';

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  useEffect(() => {
    fetchEventsFromSupabase();
  }, []);

  const fetchEventsFromSupabase = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error fetching events from Supabase:', error);
      setError('Failed to load events from database.');
      showError('Failed to load events from database.');
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<Event>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving event...');

    let error;
    if (editingEvent) {
      ({ error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', editingEvent.id));
    } else {
      ({ error } = await supabase
        .from('events')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving event:', error);
      showError(`Failed to save event: ${error.message}`);
    } else {
      showSuccess('Event saved successfully!');
      setIsFormOpen(false);
      fetchEventsFromSupabase();
    }
    setIsSubmitting(false);
  };

  const handleDeleteEvent = async (id: string) => {
    const toastId = showLoading('Deleting event...');
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting event:', error);
      showError(`Failed to delete event: ${error.message}`);
    } else {
      showSuccess('Event deleted successfully!');
      fetchEventsFromSupabase();
    }
  };

  const eventColumns = [
    { key: 'name', header: 'Name' },
    { key: 'location', header: 'Location' },
    {
      key: 'event_date',
      header: 'Date',
      render: (event: Event) => new Date(event.event_date).toLocaleDateString(),
    },
    { key: 'overall_status_str', header: 'Result' },
    {
      key: 'awards',
      header: 'Awards',
      render: (event: Event) => (event.awards && event.awards.length > 0 ? event.awards.join(', ') : 'N/A'),
    },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner text="Loading events..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchEventsFromSupabase} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Events</h2>
          <div className="flex space-x-2">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddEvent} className="bg-[#d92507] hover:bg-[#b31f06]">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                </DialogHeader>
                <EventForm
                  initialData={editingEvent}
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <DataTable
          data={events}
          columns={eventColumns}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          getKey={(event) => event.id}
        />
      </div>
    </div>
  );
};

export default AdminEvents;