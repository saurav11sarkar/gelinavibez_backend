import { Types } from 'mongoose';

export interface IApartment {
  title: string;
  description: string;
  aboutListing?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };

  amenities?: string[];
  images?: string[];
  videos?: string[];

  day: string;

  availableFrom?: {
    month: string;
    time: Date;
  };

  action: 'available' | 'rented' | 'maintenance';
  status: 'approve' | 'pending' | 'denied';

  ownerId: Types.ObjectId;

  assasintLandlordId?: Types.ObjectId[];
  assasintBrokerId?: Types.ObjectId[];

  unitId?: string;
  currentStatus?: string;
  inspectionStatus?: string[];
  keyExchangeInfo?: string[];
  packageTracking?: string[];

  notes: {
    note: string;
    noteCreate: Types.ObjectId;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}
