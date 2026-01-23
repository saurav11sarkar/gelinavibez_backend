import mongoose from 'mongoose';
import { Iservice } from './service.interface';

const serviceSchema = new mongoose.Schema<Iservice>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Service = mongoose.model<Iservice>('Service', serviceSchema);
export default Service;
