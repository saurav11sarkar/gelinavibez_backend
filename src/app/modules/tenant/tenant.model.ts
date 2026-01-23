// import mongoose, { Schema } from 'mongoose';
// import { ITenant } from './tanant.interface';

// const TenantSchema = new Schema<ITenant>(
//   {
//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     ssn: { type: String },

//     rentalHistory: {
//       currentAddress: String,
//       city: String,
//       state: String,
//       zip: String,
//       landlordName: String,
//       landlordNumber: String,
//     },

//     employmentInfo: {
//       employerName: String,
//       jobTitle: String,
//       employerAddress: String,
//       monthlyIncome: Number,
//       sourceOfIncome: String,
//     },

//     appliedAddress: {
//       address: String,
//       city: String,
//       state: String,
//       zip: String,
//     },

//     hasVoucher: { type: Boolean, default: false },
//     livesInShelter: { type: Boolean, default: false },
//     affiliatedWithHomebase: { type: Boolean, default: false },

//     uploads: {
//       idCard: String,
//       ssnDoc: String,
//       voucherDoc: String,
//       incomeDoc: String,
//     },

//     voucherInfo: {
//       programType: String,
//       caseworkerName: String,
//       caseworkerEmail: String,
//       caseworkerNumber: String,
//     },

//     applicantSignature: String,
//     date: Date,
//     acceptedTerms: { type: Boolean, default: false },

//     status: {
//       type: String,
//       enum: ['pending', 'approved', 'denied'],
//       default: 'pending',
//     },

//     paymentId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Payment',
//     },
//     createBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//     },
//     apartmentId: {
//       type: Schema.Types.ObjectId,
//       ref: 'Apartment',
//     },
//   },
//   { timestamps: true },
// );

// const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);
// export default Tenant;

// tenant.model.ts
import mongoose, { Schema } from 'mongoose';
import { ITenant } from './tanant.interface';

const VoucherSchema = new Schema({
  hasVoucher: { type: Boolean, default: false },
  type: {
    type: [String],
    // enum: [String],
    required: function (this: any) {
      return this.hasVoucher === true;
    },
  },
});

const HousingSpecialistSchema = new Schema({
  name: String,
  email: String,
  phone: String,
});

const AgreementItemSchema = new Schema({
  accepted: { type: Boolean, required: true },
  signature: { type: String },
});

const AgreementsSchema = new Schema({
  agreement1: { type: AgreementItemSchema, required: true },
  agreement2: { type: AgreementItemSchema, required: true },
  agreement3: { type: AgreementItemSchema, required: true },
});

const TenantSchema = new Schema<ITenant>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    ssn: { type: String },

    rentalHistory: {
      currentAddress: String,
      city: String,
      state: String,
      zip: String,
      landlordName: String,
      landlordNumber: String,
    },

    employmentInfo: {
      employerName: String,
      jobTitle: String,
      employerAddress: String,
      monthlyIncome: Number,
      sourceOfIncome: String,
    },

    appliedAddress: {
      address: String,
      city: String,
      state: String,
      zip: String,
    },

    // New fields
    smoking: { type: Boolean, required: true },
    pets: { type: Boolean, required: true },
    voucher: { type: VoucherSchema, required: true },
    livesInShelter: { type: Boolean, default: false },
    affiliatedWithHomebase: { type: Boolean, default: false },
    housingSpecialist: { type: HousingSpecialistSchema },

    uploads: {
      idCard: String,
      ssnDoc: String,
      voucherDoc: String,
      incomeDoc: String,
    },

    agreements: { type: AgreementsSchema, required: true },

    applicantSignature: String,
    date: Date,
    acceptedTerms: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending',
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Apartment',
    },
  },
  { timestamps: true },
);

// Optional: Hide rentalHistory if livesInShelter is true
TenantSchema.pre('save', function (next) {
  if (this.livesInShelter) {
    this.rentalHistory = undefined;
  }
  next();
});

const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);
export default Tenant;
