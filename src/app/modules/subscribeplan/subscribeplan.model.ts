import mongoose, { Schema } from 'mongoose';
import { ISubscribePlan } from './subscribeplan.interface';

const subscribePlanSchema = new Schema<ISubscribePlan>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['monthly', 'yearly'], required: true },
    price: { type: Number, required: true },
    features: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionUser: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
);

const SubscribePlan = mongoose.model<ISubscribePlan>(
  'SubscribePlan',
  subscribePlanSchema,
);

export default SubscribePlan;
