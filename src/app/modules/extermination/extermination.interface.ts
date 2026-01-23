import { Types } from 'mongoose';

export interface IExtermination {
  fullName: string;
  email: string;
  phoneNumber: string;
  propertyAddress: string;
  typeOfProperty: string[];
  preferredContactMethod: string[];

  typeOfPestProblem: string[];
  locationOfProblem: string[];
  durationOfIssue?: string;
  previousExterminationService: 'Yes' | 'No';
  previousExterminationDate?: string;

  preferredServiceDate: string;
  preferredTime: string[];
  buildingAccessRequired: 'Yes' | 'No';
  contactInfo?: string;

  signature: string;
  date: string;
  user: Types.ObjectId;
  contractor?: Types.ObjectId;
  status?: 'pending' | 'assigned' | 'completed' | 'paid';
  assigningExtermination?: Types.ObjectId;
  charges?: number;
}
