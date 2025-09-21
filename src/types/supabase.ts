export interface Event {
  id: string;
  name: string;
  location: string;
  awards: string[] | null;
  event_date: string; // ISO string for date
  // Flattened status fields
  qual_rank: number | null;
  playoff_status: string | null; // e.g., "eliminated in quarterfinals"
  alliance_status: string | null; // e.g., "captain"
  overall_status_str: string | null; // e.g., "Rank 5, Eliminated in Semifinals"
  record_wins: number | null;
  record_losses: number | null;
  record_ties: number | null;
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
  website_url: string | null; // New field for sponsor website
  image_fit: 'contain' | 'cover' | null; // Added image_fit
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

export interface SocialMediaLink {
  type: 'facebook' | 'instagram' | 'youtube' | 'x' | 'linkedin' | 'github' | 'website' | 'custom';
  url: string;
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
  // Footer fields
  footer_address: string | null;
  footer_email: string | null;
  social_media_links: SocialMediaLink[] | null; // Updated to dynamic array
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

export interface SlideshowImage {
  id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  publish_date: string; // ISO string for date
  content: string;
  image_urls: string[] | null; // Array of image URLs
  created_at: string;
  updated_at: string;
}