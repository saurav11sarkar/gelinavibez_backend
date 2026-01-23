import mongoose from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from 'bcryptjs';
import config from '../../config';

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        'admin',
        'user',
        'contractor',
        'superadmin',
        'exterminator',
        'landlord',
        'broker',
      ],
      default: 'user',
    },
    profileImage: { type: String },
    bio: { type: String },
    location: { type: String },
    jobTitle: { type: String },
    phone: { type: String },
    otp: { type: String },
    otpExpiry: { type: Date },
    verified: { type: Boolean, default: true },
    isSubscription: { type: Boolean, default: false },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubscribePlan',
    },
    approvedLandlordBrokerAdmin: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
    },
    stripeAccountId: { type: String },
    subscriptionExpiry: { type: Date },

    requestAdmin: { type: Boolean },
    accessRoutes: [{ type: String }],
    messagingPermissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcryptSaltRounds),
    );
  }
  next();
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
