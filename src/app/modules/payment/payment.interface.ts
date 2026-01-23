import { Document, Types } from 'mongoose';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;

  tenantName: string;
  tenantEmail: string;
  amount: number;
  adminFree?: number;
  contractorFree?: number;
  status: 'pending' | 'approved' | 'denied';
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paymentDate?: Date;
  user: Types.ObjectId;
  subscribePlanId?: Types.ObjectId;
  paymentType: string;

  // new fields
  contractor?: Types.ObjectId; // contractor service
  extermination?: Types.ObjectId; // extermination request
  service?: Types.ObjectId; // service type
  apartmentName?: string; // apartment name
  typeOfProblem?: string; // type of problem
  chargeId?: Types.ObjectId;
}
