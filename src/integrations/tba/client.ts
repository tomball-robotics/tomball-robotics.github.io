import { Event } from '@/types/supabase';

const TBA_BASE_URL = "https://www.thebluealliance.com/api/v3";
const TBA_AUTH_KEY = import.meta.env.VITE_TBA_AUTH_KEY;

if (!TBA_AUTH_KEY) {
  console.error("VITE_TBA_AUTH_KEY is not set. Please add it to your .env.local file.");
}

interface TBAAward {
  name: string;
  award_type: number;
  event_key: string;
  recipient_list: Array<{ team_key: string; awardee: string | null }>;
  year: number;
}

interface TBAEventRaw {
  key: string;
  name: string;
  event_code: string;
  event_type: number;
  city: string | null;
  state_prov: string | null;
  country: string | null;
  start_date: string;
  end_date: string;
  year: number;
  website: string | null;
  awards: TBAAward[] | null;
  // Add other fields if needed, but these are sufficient for current Event type
}

export const fetchTBAEventsByYear = async (year: number): Promise<Event[]> => {
  if (!TBA_AUTH_KEY) {
    throw new Error("TBA Auth Key is missing. Cannot fetch events.");
  }

  try {
    const response = await fetch(`${TBA_BASE_URL}/events/${year}/simple`, {
      headers: {
        'X-TBA-Auth-Key': TBA_AUTH_KEY,
        'If-None-Match': '', // Always fetch fresh data for simplicity, can be optimized with ETag
      },
    });

    if (!response.ok) {
      if (response.status === 304) {
        console.log(`TBA Events for ${year} not modified.`);
        return []; // No new data
      }
      const errorText = await response.text();
      throw new Error(`Failed to fetch events from TBA: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const rawEvents: TBAEventRaw[] = await response.json();

    // Fetch full event details for awards, as 'simple' endpoint doesn't include them
    const detailedEventsPromises = rawEvents.map(async (simpleEvent) => {
      const detailResponse = await fetch(`${TBA_BASE_URL}/event/${simpleEvent.key}`, {
        headers: {
          'X-TBA-Auth-Key': TBA_AUTH_KEY,
        },
      });
      if (!detailResponse.ok) {
        console.warn(`Failed to fetch detailed event for ${simpleEvent.key}: ${detailResponse.statusText}`);
        return simpleEvent; // Return simple event if detailed fetch fails
      }
      return detailResponse.json();
    });

    const detailedEvents: TBAEventRaw[] = await Promise.all(detailedEventsPromises);


    return detailedEvents.map(tbaEvent => ({
      id: tbaEvent.key,
      name: tbaEvent.name,
      location: `${tbaEvent.city || ''}${tbaEvent.city && tbaEvent.state_prov ? ', ' : ''}${tbaEvent.state_prov || ''}${tbaEvent.state_prov && tbaEvent.country ? ', ' : ''}${tbaEvent.country || ''}`.trim(),
      awards: tbaEvent.awards ? tbaEvent.awards.map(award => award.name) : [],
      event_date: tbaEvent.start_date,
    }));
  } catch (error) {
    console.error(`Error fetching TBA events for year ${year}:`, error);
    throw error;
  }
};