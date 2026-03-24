import { Event, WebsiteSettings } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

const TBA_BASE_URL = "https://www.thebluealliance.com/api/v3";
const TEAM_KEY = "frc7312";

export const fetchTBAEventsByYear = async (year: number): Promise<Event[]> => {
  // First, try to get the key from the database settings
  const { data: settings } = await supabase
    .from('website_settings')
    .select('tba_api_key')
    .maybeSingle();

  // Fallback to environment variable if database key is missing
  const authKey = settings?.tba_api_key || import.meta.env.VITE_TBA_AUTH_KEY;

  if (!authKey || authKey.trim() === "") {
    console.error("TBA API Key is missing. Please set it in the Admin Panel or environment variables.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    const response = await fetch(`${TBA_BASE_URL}/team/${TEAM_KEY}/events/${year}/simple`, {
      headers: {
        'X-TBA-Auth-Key': authKey,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      if (response.status === 401) {
        throw new Error("API_KEY_INVALID");
      }
      const errorText = await response.text();
      throw new Error(`TBA_API_ERROR: ${response.status} - ${errorText}`);
    }

    const rawEvents = await response.json();
    if (!Array.isArray(rawEvents) || rawEvents.length === 0) {
      return [];
    }

    const detailedEventsPromises = rawEvents.map(async (simpleEvent: any) => {
      const statusResponse = await fetch(`${TBA_BASE_URL}/team/${TEAM_KEY}/event/${simpleEvent.key}/status`, {
        headers: { 'X-TBA-Auth-Key': authKey },
      });
      let teamStatus = null;
      if (statusResponse.ok) {
        teamStatus = await statusResponse.json();
      }

      const awardsResponse = await fetch(`${TBA_BASE_URL}/team/${TEAM_KEY}/event/${simpleEvent.key}/awards`, {
        headers: { 'X-TBA-Auth-Key': authKey },
      });
      let teamAwards: string[] = [];
      if (awardsResponse.ok) {
        const rawAwards = await awardsResponse.json();
        teamAwards = rawAwards.map((award: any) => award.name);
      }

      return { simpleEvent, teamStatus, teamAwards };
    });

    const results = await Promise.all(detailedEventsPromises);

    return results.map(({ simpleEvent, teamStatus, teamAwards }) => ({
      id: simpleEvent.key,
      name: simpleEvent.name,
      location: `${simpleEvent.city || ''}${simpleEvent.city && simpleEvent.state_prov ? ', ' : ''}${simpleEvent.state_prov || ''}${simpleEvent.state_prov && simpleEvent.country ? ', ' : ''}${simpleEvent.country || ''}`.trim(),
      awards: teamAwards,
      event_date: simpleEvent.start_date,
      qual_rank: teamStatus?.qual?.ranking?.rank || null,
      playoff_status: teamStatus?.playoff?.status || null,
      alliance_status: teamStatus?.alliance?.name || null,
      overall_status_str: teamStatus?.overall_status_str || null,
      record_wins: teamStatus?.qual?.ranking?.record?.wins || null,
      record_losses: teamStatus?.qual?.ranking?.record?.losses || null,
      record_ties: teamStatus?.qual?.ranking?.record?.ties || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      video_url: null,
      source: 'tba',
    }));
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING" || error.message === "API_KEY_INVALID") {
      throw error;
    }
    console.error(`Error fetching TBA events for year ${year}:`, error);
    return [];
  }
};