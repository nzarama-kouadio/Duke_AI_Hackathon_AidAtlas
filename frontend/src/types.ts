export interface Donation {
  id: string;
  donorCountry: string;
  recipientCountry: string;
  amount: number | null;
  message: string | null;
  createdAt: string;
}

export interface GlobeArcDatum {
  id: string;
  donorName: string;
  recipientName: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  createdAt: string;
}
