import { Event } from '@/types/supabase';

const TBA_BASE_URL = "https://www.thebluealliance.com/api/v3";
const TBA_AUTH_KEY = import.meta.env.VITE_TBA_AUTH_KEY;
const TEAM_KEY = "frc7312";

export const fetchTBAEventsByYear = async (year: number): Promise<Event[]> => {
  // Check if key exists and isn't just an empty string
  if (!TBA_AUTH_KEY || TBA_AUTH_KEY.trim() === "") {
    console.error("VITE_TBA_AUTH_KEY is missing or empty.");
    throw new Error("API_KEY_MISSING");
  }

  try {
    const response = await fetch(`${TBA_BASE_URL}/team/${TEAM_KEY}/events/${year}/simple`, {
      headers: {
        'X-TBA-Auth-Key': TBA_AUTH_KEY,
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
        headers: { 'X-TBA-Auth-Key': TBA_AUTH_KEY },
      });
      let teamStatus = null;
      if (statusResponse.ok) {
        teamStatus = await statusResponse.json();
      }

      const awardsResponse = await fetch(`${TBA_BASE_URL}/team/${TEAM_KEY}/event/${simpleEvent.key}/awards`, {
        headers: { 'X-TBA-Auth-Key': TBA_AUTH_KEY },
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
    // Re-throw auth errors so the UI can handle them specifically
    if (error.message === "API_KEY_MISSING" || error.message === "API_KEY_INVALID") {
      throw error;
    }
    console.error(`Error fetching TBA events for year ${year}:`, error);
    // For other errors (like network timeouts), we return empty to let other years finish
    return [];
  }
};