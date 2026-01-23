import { Types } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role:
    | 'admin'
    | 'user'
    | 'contractor'
    | 'superadmin'
    | 'exterminator'
    | 'landlord'
    | 'broker';
  profileImage?: string;
  bio?: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  otp?: string;
  otpExpiry?: Date;
  verified?: boolean;

  requestAdmin?: boolean;
  accessRoutes?: string[];
  isSubscription?: boolean;
  subscription?: Types.ObjectId;
  subscriptionExpiry?: Date;
  stripeAccountId?: string;
  approvedLandlordBrokerAdmin?: 'pending' | 'approved' | 'rejected';
  messagingPermissions?: Types.ObjectId[];
}
