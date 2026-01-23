import mongoose, { Schema } from 'mongoose';
import { IExtermination } from './extermination.interface';

const exterminationSchema = new Schema<IExtermination>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    propertyAddress: { type: String, required: true },
    //update propertyAddress
    assigningExtermination: { type: Schema.Types.ObjectId, ref: 'User' },
    charges: { type: Number },

    typeOfProperty: { type: [String], required: true },
    preferredContactMethod: { type: [String], required: true },

    typeOfPestProblem: { type: [String], required: true },
    locationOfProblem: { type: [String], required: true },
    durationOfIssue: { type: String },

    previousExterminationService: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    previousExterminationDate: { type: String },

    preferredServiceDate: { type: String, required: true },
    preferredTime: { type: [String], required: true },
    buildingAccessRequired: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    contactInfo: { type: String },

    signature: { type: String, required: true },
    date: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // contractor: { type: Schema.Types.ObjectId, ref: 'Contractor' },
    // new fields
    status: {
      type: String,
      enum: ['pending', 'assigned', 'completed', 'paid'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

// exterminationSchema.virtual('charges', {
//   ref: 'Charge', // Model to use
//   localField: '_id', // Extermination _id
//   foreignField: 'extermination', // Charge.extermination references this
// });

const Extermination = mongoose.model<IExtermination>(
  'Extermination',
  exterminationSchema,
);

export default Extermination;
