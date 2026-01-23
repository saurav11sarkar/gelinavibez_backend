// import { Document, Types } from 'mongoose';

// export interface ITenant extends Document {
//   _id: Types.ObjectId;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   ssn?: string;

//   rentalHistory: {
//     currentAddress?: string;
//     city?: string;
//     state?: string;
//     zip?: string;
//     landlordName?: string;
//     landlordNumber?: string;
//   };

//   employmentInfo: {
//     employerName?: string;
//     jobTitle?: string;
//     employerAddress?: string;
//     monthlyIncome?: number;
//     sourceOfIncome?: string;
//   };

//   appliedAddress: {
//     address?: string;
//     city?: string;
//     state?: string;
//     zip?: string;
//   };

//   hasVoucher: boolean;
//   livesInShelter: boolean;
//   affiliatedWithHomebase: boolean;

//   uploads: {
//     idCard?: string;
//     ssnDoc?: string;
//     voucherDoc?: string;
//     incomeDoc?: string;
//   };

//   voucherInfo: {
//     programType?: string;
//     caseworkerName?: string;
//     caseworkerEmail?: string;
//     caseworkerNumber?: string;
//   };

//   applicantSignature?: string;
//   date?: Date;
//   acceptedTerms: boolean;

//   status: 'pending' | 'approved' | 'denied';
//   paymentId?: Types.ObjectId;
//   createBy?: Types.ObjectId;
//   apartmentId?: Types.ObjectId;
// }

// tenant.interface.ts
import { Document, Types } from 'mongoose';

export interface ITenant extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ssn?: string;

  rentalHistory?: {
    currentAddress?: string;
    city?: string;
    state?: string;
    zip?: string;
    landlordName?: string;
    landlordNumber?: string;
  };

  employmentInfo: {
    employerName?: string;
    jobTitle?: string;
    employerAddress?: string;
    monthlyIncome?: number;
    sourceOfIncome?: string;
  };

  appliedAddress: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };

  // New fields
  smoking: boolean;
  pets: boolean;
  voucher: {
    hasVoucher: boolean;
    type?: 'CityFHEPS' | 'Section8' | 'FHEPS' | 'Other';
  };
  livesInShelter: boolean;
  affiliatedWithHomebase: boolean;

  // Housing Specialist (formerly Caseworker)
  housingSpecialist?: {
    name?: string;
    email?: string;
    phone?: string;
  };

  uploads: {
    idCard?: string;
    ssnDoc?: string;
    voucherDoc?: string;
    incomeDoc?: string;
  };

  // Agreements
  agreements: {
    agreement1: boolean;
    agreement2: boolean;
    agreement3: boolean;
    signature: string;
  };

  applicantSignature?: string;
  date?: Date;
  acceptedTerms: boolean;

  status: 'pending' | 'approved' | 'denied';
  paymentId?: Types.ObjectId;
  createBy?: Types.ObjectId;
  apartmentId?: Types.ObjectId;
}
