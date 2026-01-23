import mongoose from 'mongoose';
import { ICallRequest } from './callRequest.interface';

const callRequestSchema = new mongoose.Schema<ICallRequest>(
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
    visiting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    addNode: {
      type: String,
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);
const CallRequest = mongoose.model<ICallRequest>(
  'CallRequest',
  callRequestSchema,
);
export default CallRequest;
