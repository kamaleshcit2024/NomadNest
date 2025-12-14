export interface TravelQuery {
  origin: string;
  destination: string;
  purpose: string;
}

export interface TravelReport {
  visaSection: string;
  safetySection: string;
  cultureSection: string;
  itinerarySection: string;
  groundingLinks: GroundingLink[];
}

export interface GroundingLink {
  title: string;
  url: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type PageView = 'HOME' | 'DESTINATIONS' | 'COMMUNITY' | 'RESOURCES';
