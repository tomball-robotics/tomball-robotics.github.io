export interface Event {
  id: string;
  year: number;
  name: string;
  location: string;
  awards: string[] | null; // Supabase TEXT[] can be null
  created_at: string;
  updated_at: string;
}

export interface Sponsor {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Banner {
  id: string;
  year: string;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface InitiativeLink {
  text: string;
  url: string;
}

export interface UnitybotResource {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  links: InitiativeLink[]; // JSONB in Supabase, mapped to array of objects
  created_at: string;
  updated_at: string;
}

export interface UnitybotInitiative {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  links: InitiativeLink[]; // JSONB in Supabase, mapped to array of objects
  created_at: string;
  updated_at: string;
}

export interface WebsiteSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_background_image: string;
  about_preview_title: string;
  about_preview_description: string;
  about_preview_image_url: string;
  events_preview_title: string;
  events_preview_description: string;
  sponsors_preview_title: string;
  sponsors_preview_description: string;
  created_at: string;
  updated_at: string;
}

export interface Robot {
  id: string;
  name: string;
  year: number;
  image_url: string | null;
  specs: string | null;
  awards: string | null; // Stored as a single text string
  created_at: string;
  updated_at: string;
}

export interface SponsorshipTier {
  id: string;
  name: string;
  price: string;
  benefits: string[] | null; // Supabase TEXT[] can be null
  color: string;
  tier_id: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  year: string;
  description: string;
  created_at: string;
  updated_at: string;
}