export type PhaseCategory = 
  | 'Phase 1'
  | 'Phase 2'
  | 'The Defenders Saga'
  | 'Phase 3'
  | 'Phase 4'
  | 'Phase 5'
  | 'Phase 6'
  | 'X-Men & Legacy Marvel Universe';

export type MediaType = 'movie' | 'show' | 'special';

export type AvailabilityStatus = 'available' | 'unavailable' | 'unreleased';

export interface MCUItem {
  id: string;
  order: number; // 1 to 95
  title: string;
  phase: PhaseCategory;
  mediaType: MediaType;
  year?: string;
  
  hotstarUrl: string | null;
  hotstarStatus: AvailabilityStatus;
  
  ytsUrl: string | null;
  ytsStatus: AvailabilityStatus;

  netflixUrl?: string | null;
  netflixStatus?: AvailabilityStatus;

  amznPrimeUrl?: string | null;
  amznPrimeStatus?: AvailabilityStatus;
  
  posterUrl: string;
  description?: string;
}

export type ViewMode = 'grid' | 'table';

export interface FilterState {
  searchQuery: string;
  phase: string; // 'All' or PhaseCategory
  availability: 'all' | 'hotstar' | 'yts' | 'both';
  mediaType: 'all' | 'movie' | 'show';
  sortBy: 'order-asc' | 'order-desc' | 'title-asc' | 'title-desc';
}
