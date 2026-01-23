import mongoose, { Schema } from 'mongoose';
import { ICharge } from './charge.interface';

const ChargeSchema = new Schema<ICharge>(
  {
    extermination: {
      type: Schema.Types.ObjectId,
      ref: 'Extermination',
      required: true,
    },
    contractor: {
      type: Schema.Types.ObjectId,
      ref: 'Contractor',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
    dueDate: {
      type: Date,
    },
    apartmentName: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    isPayment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Charge = mongoose.model<ICharge>('Charge', ChargeSchema);
export default Charge;
