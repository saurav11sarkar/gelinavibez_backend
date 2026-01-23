import mongoose, { Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const PaymentSchema = new Schema<IPayment>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    tenantName: { type: String },
    tenantEmail: { type: String },
    amount: { type: Number, default: 20 },
    adminFree: { type: Number },
    contractorFree: { type: Number },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending',
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    paymentDate: Date,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscribePlanId: {
      type: Schema.Types.ObjectId,
      ref: 'SubscribePlan',
    },
    paymentType: { type: String, required: true },

    // new fields
    contractor: { type: Schema.Types.ObjectId, ref: 'Contractor' },
    extermination: { type: Schema.Types.ObjectId, ref: 'Extermination' },
    service: { type: Schema.Types.ObjectId, ref: 'Service' },
    apartmentName: String,
    typeOfProblem: String,
    chargeId: { type: Schema.Types.ObjectId, ref: 'Charge' },
  },
  { timestamps: true },
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
