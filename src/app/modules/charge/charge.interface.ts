import mongoose from 'mongoose';

export interface ICharge {
  extermination: mongoose.Types.ObjectId;
  contractor: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  description?: string;
  status: 'pending' | 'paid' | 'cancelled';
  dueDate?: Date;
  apartmentName: string;
  serviceType: string;
  isPayment: boolean;
}
