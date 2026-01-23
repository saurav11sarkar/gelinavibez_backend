import mongoose from 'mongoose';
import { ISubscribe } from './subscribe.interface';

const subscribeSchema = new mongoose.Schema<ISubscribe>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Subscribe = mongoose.model<ISubscribe>('Subscribe', subscribeSchema);
export default Subscribe;
