import mongoose, { Schema, Types } from 'mongoose';
import { IApartment } from './apartment.interface';

const apartmentSchema = new Schema<IApartment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    aboutListing: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    squareFeet: {
      type: Number,
      required: true,
      min: 0,
    },

    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    videos: {
      type: [String],
      default: [],
    },
    day: {
      type: String,
      enum: [
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
      ],
    },

    availableFrom: {
      month: { type: String, trim: true },
      time: { type: Date },
    },
    action: {
      type: String,
      enum: ['available', 'rented', 'maintenance'],
      default: 'available',
    },

    status: {
      type: String,
      enum: ['approve', 'pending', 'denied'],
      default: 'pending',
    },
    assasintLandlordId: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    assasintBrokerId: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },

    unitId: String,
    currentStatus: String,
    inspectionStatus: [String],
    keyExchangeInfo: [String],
    packageTracking: [String],

    notes: [
      {
        note: String,
        noteCreate: Types.ObjectId,
      },
    ],

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Apartment = mongoose.model<IApartment>('Apartment', apartmentSchema);

export default Apartment;
