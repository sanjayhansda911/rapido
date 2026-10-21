export type MetroLine = 'blue' | 'red' | 'green';

export interface Station {
  id: string;
  name: string;
  line: MetroLine;
  lineName: string;
  platform: string;
  isPopular?: boolean;
}

export interface TravellerDraft {
  id: string;
  name: string;
  isPrimary: boolean;
  destination: string;
  fare: number;
}

export type TicketStatus = 'active' | 'processing' | 'failed' | 'cancelled' | 'completed' | 'expired';

export interface Ticket {
  id: string;
  bookingId: string;
  travellerName: string;
  isPrimary: boolean;
  origin: string;
  destination: string;
  fare: number;
  status: TicketStatus;
  qrToken: string;
  platform: string;
  line: MetroLine;
  purchaseDate: string;
  validUntil: string;
  failureReason?: string;
  refundAmount?: number;
  cancelledAt?: string;
}

export interface GroupTrip {
  id: string;
  bookingCode: string;
  origin: string;
  purchaseDate: string;
  tickets: Ticket[];
  totalFare: number;
  status: 'active' | 'completed' | 'partial_failure';
}

export type ScreenType = 
  | 'home' 
  | 'station_select' 
  | 'book' 
  | 'processing' 
  | 'confirmed' 
  | 'friend_qr' 
  | 'my_tickets';
