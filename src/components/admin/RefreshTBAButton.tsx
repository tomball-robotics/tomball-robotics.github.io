import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchTBAEventsByYear } from '@/integrations/tba/client';
import { Event } from '@/types/supabase';

const FOUNDING_YEAR = 2018;

interface RefreshTBAButtonProps {
  onRefreshComplete?: () => void;
  description?: string;
}

const RefreshTBAButton: React.FC<RefreshTBAButtonProps> = ({ onRefreshComplete, description }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefreshFromTBA = async () => {
    setIsSyncing(true);
    const toastId = showLoading('Refreshing events from The Blue Alliance...');

    try {
      // Dynamically calculate the year range: from founding year to next year
      const currentYear = new Date().getFullYear();
      const yearsToFetch: number[] = [];
      for (let year = FOUNDING_YEAR; year <= currentYear + 1; year++) {
        yearsToFetch.push(year);
      }

      const allEventsPromises = yearsToFetch.map(year => fetchTBAEventsByYear(year));
      const results = await Promise.allSettled(allEventsPromises);

      const fetchedEvents: Event[] = [];
      let authError = false;
      let networkErrorCount = 0;

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          fetchedEvents.push(...result.value);
        } else {
          const errorMsg = result.reason?.message || "";
          if (errorMsg === "API_KEY_MISSING" || errorMsg === "API_KEY_INVALID") {
            authError = true;
          } else {
            networkErrorCount++;
          }
        }
      });

      if (authError) {
        showError('The Blue Alliance API key is missing or invalid. Please set it in the "TBA API Settings" section under Global Settings.');
        dismissToast(toastId);
        setIsSyncing(false);
        return;
      }

      if (fetchedEvents.length === 0) {
        if (networkErrorCount > 0) {
          showError('Failed to connect to The Blue Alliance. Please check your internet connection.');
        } else {
          showError('No events found on The Blue Alliance for Team 7312. Please verify your API key.');
        }
        dismissToast(toastId);
        setIsSyncing(false);
        return;
      }

      // Clear existing TBA events in Supabase
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('source', 'tba');

      if (deleteError) {
        showError(`Failed to clear existing events: ${deleteError.message}`);
        dismissToast(toastId);
        setIsSyncing(false);
        return;
      }

      // Insert new events
      const { error: insertError } = await supabase.from('events').insert(fetchedEvents);
      
      if (insertError) {
        showError(`Failed to save new events: ${insertError.message}`);
      } else {
        showSuccess(`Successfully synced ${fetchedEvents.length} events from TBA!`);
        onRefreshComplete?.();
      }
    } catch (err: any) {
      showError(`An unexpected error occurred: ${err.message}`);
    } finally {
      dismissToast(toastId);
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={handleRefreshFromTBA} disabled={isSyncing} className="bg-[#0d2f60] hover:bg-[#0a244a]">
        <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} /> 
        {isSyncing ? 'Syncing...' : 'Sync All Event Data from TBA'}
      </Button>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
};

export default RefreshTBAButton;