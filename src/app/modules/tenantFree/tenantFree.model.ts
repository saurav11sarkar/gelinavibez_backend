import mongoose from 'mongoose';

const tenantFreeSchema = new mongoose.Schema(
  {
    applicationFee: { type: Number, required: true, default: 20 },
  },
  { timestamps: true },
);

const TenantFree = mongoose.model('TenantFree', tenantFreeSchema);
export default TenantFree;
