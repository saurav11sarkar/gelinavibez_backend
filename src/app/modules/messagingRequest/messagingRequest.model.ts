import mongoose, { Schema } from 'mongoose';
import { IMessagingRequest } from './messagingRequest.interface';

const messagingRequestSchema = new Schema<IMessagingRequest>(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const MessagingRequest = mongoose.model(
  'MessagingRequest',
  messagingRequestSchema,
);

export default MessagingRequest;
