import { Event, TeamEventStatus } from '@/types/supabase'; // Import TeamEventStatus

const TBA_BASE_URL = "https://www.thebluealliance.com/api/v3";
const TBA_AUTH_KEY = import.meta.env.VITE_TBA_AUTH_KEY;
const TEAM_KEY = "frc7312"; // Define the team key here

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

interface TBATeamEventStatusRaw {
  qual: {
    num_teams: number;
    ranking: {
      rank: number;
      dq: number;
      matches_played: number;
      record: { wins: number; losses: number; ties: number };
      // ... other ranking details
    };
    // ... other qual details
  };
  playoff: {
    level: string; // e.g., "qf", "sf", "f"
    status: string; // e.g., "won", "eliminated"
    // ... other playoff details
  };
  alliance: {
    name: string;
    number: number;
    pick: number;
    // ... other alliance details
  };
  overall_status_str: string; // e.g., "Rank 5, Eliminated in Semifinals"
  // ... other status details
}


export const fetchTBAEventsByYear = async (year: number): Promise<Event[]> => {
  if (!TBA_AUTH_KEY) {
    throw new Error("TBA Auth Key is missing. Cannot fetch events.");
  }

  try {
    // Fetch events for the specific team
    const response = await fetch(`${TBA_BASE_URL}/team/${TEAM_KEY}/events/${year}/simple`, {
      headers: {
        'X-TBA-Auth-Key': TBA_AUTH_KEY,
        'If-None-Match': '',
      },
    });

    if (!response.ok) {
      if (response.status === 304) {
        console.log(`TBA Events for team ${TEAM_KEY} in ${year} not modified.`);
        return [];
      }
      const errorText = await response.text();
      throw new Error(`Failed to fetch events for team ${TEAM_KEY} from TBA: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const rawEvents: TBAEventRaw[] = await response.json();

    const detailedEventsPromises = rawEvents.map(async (simpleEvent) => {
      // Fetch full event details for awards
      const detailResponse = await fetch(`${TBA_BASE_URL}/event/${simpleEvent.key}`, {
        headers: {
          'X-TBA-Auth-Key': TBA_AUTH_KEY,
        },
      });
      let detailedEvent: TBAEventRaw = simpleEvent;
      if (detailResponse.ok) {
        detailedEvent = await detailResponse.json();
      } else {
        console.warn(`Failed to fetch detailed event for ${simpleEvent.key}: ${detailResponse.statusText}`);
      }

      // Fetch team's status for this event
      const statusResponse = await fetch(`${TBA_BASE_URL}/team/${TEAM_KEY}/event/${simpleEvent.key}/status`, {
        headers: {
          'X-TBA-Auth-Key': TBA_AUTH_KEY,
        },
      });
      let teamStatus: TBATeamEventStatusRaw | null = null;
      if (statusResponse.ok) {
        teamStatus = await statusResponse.json();
      } else {
        console.warn(`Failed to fetch team status for event ${simpleEvent.key}: ${statusResponse.statusText}`);
      }

      return { detailedEvent, teamStatus };
    });

    const results = await Promise.all(detailedEventsPromises);

    return results.map(({ detailedEvent, teamStatus }) => ({
      id: detailedEvent.key,
      name: detailedEvent.name,
      location: `${detailedEvent.city || ''}${detailedEvent.city && detailedEvent.state_prov ? ', ' : ''}${detailedEvent.state_prov || ''}${detailedEvent.state_prov && detailedEvent.country ? ', ' : ''}${detailedEvent.country || ''}`.trim(),
      awards: detailedEvent.awards ? detailedEvent.awards.map(award => award.name) : [],
      event_date: detailedEvent.start_date,
      status: teamStatus ? {
        qual_rank: teamStatus.qual?.ranking?.rank || null,
        playoff_status: teamStatus.playoff?.status || null,
        alliance_status: teamStatus.alliance?.name || null, // Using alliance name as status for simplicity
        overall_status_str: teamStatus.overall_status_str || null,
        record_wins: teamStatus.qual?.ranking?.record?.wins || null,
        record_losses: teamStatus.qual?.ranking?.record?.losses || null,
        record_ties: teamStatus.qual?.ranking?.record?.ties || null,
      } : null,
    }));
  } catch (error) {
    console.error(`Error fetching TBA events for year ${year}:`, error);
    throw error;
  }
};