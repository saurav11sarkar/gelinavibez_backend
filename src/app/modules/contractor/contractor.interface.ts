import { Types } from 'mongoose';

export interface IContractor {
  companyName: string;
  CompanyAddress: string;
  name: string;
  number: string;
  email: string;
  serviceAreas: string;
  scopeWork: string;
  worlHour: number;
  superContact: string;
  superName: string;
  images: string[];
  videos: string[];
  service: Types.ObjectId[];
  user?: Types.ObjectId;
  assigningContractor?: Types.ObjectId;
  charges?: number;
  status?: 'pending' | 'assigned' | 'completed' | 'paid';
}
