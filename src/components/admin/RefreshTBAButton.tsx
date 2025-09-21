import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchTBAEventsByYear } from '@/integrations/tba/client';
import { Event } from '@/types/supabase';

const FOUNDING_YEAR = 2018; // Define the team's founding year

interface RefreshTBAButtonProps {
  onRefreshComplete?: () => void; // Callback to notify parent when refresh is done
  description?: string; // New prop for description text
}

const RefreshTBAButton: React.FC<RefreshTBAButtonProps> = ({ onRefreshComplete, description }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefreshFromTBA = async () => {
    setIsSyncing(true);
    const toastId = showLoading('Refreshing events from The Blue Alliance...');

    try {
      const currentYear = new Date().getFullYear();
      const yearsToFetch: number[] = [];
      for (let year = FOUNDING_YEAR; year <= currentYear; year++) {
        yearsToFetch.push(year);
      }

      const allEventsPromises = yearsToFetch.map(year => fetchTBAEventsByYear(year));
      const results = await Promise.allSettled(allEventsPromises);

      const fetchedEvents: Event[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          fetchedEvents.push(...result.value);
        } else {
          console.error(`Error fetching events for year ${yearsToFetch[index]} from TBA:`, result.reason);
          showError(`Failed to fetch some events from TBA for year ${yearsToFetch[index]}.`);
        }
      });

      if (fetchedEvents.length === 0) {
        showError('No events fetched from The Blue Alliance. Please check your TBA API key and network.');
        return;
      }

      // Clear existing events in Supabase
      const { error: deleteError } = await supabase.from('events').delete().neq('id', 'dummy_id'); // Delete all rows
      if (deleteError) {
        console.error('Error clearing existing events:', deleteError);
        showError(`Failed to clear existing events: ${deleteError.message}`);
        return;
      }

      // Insert new events into Supabase
      const { error: insertError } = await supabase.from('events').insert(fetchedEvents);
      if (insertError) {
        console.error('Error inserting new events:', insertError);
        showError(`Failed to save new events: ${insertError.message}`);
      } else {
        showSuccess('Events refreshed and saved successfully!');
        onRefreshComplete?.(); // Notify parent component
      }
    } catch (err) {
      console.error('Overall error during TBA refresh:', err);
      showError(`An unexpected error occurred during refresh: ${(err as Error).message}`);
    } finally {
      dismissToast(toastId);
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleRefreshFromTBA} disabled={isSyncing} className="bg-[#0d2f60] hover:bg-[#0a244a]">
        <RefreshCw className="mr-2 h-4 w-4" /> {isSyncing ? 'Syncing...' : 'Sync All Event Data from TBA'}
      </Button>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
};

export default RefreshTBAButton;