import { ITenantFree } from './tenantFree.interface';
import TenantFree from './tenantFree.model';

const getApplicationFee = async () => {
  let applicationFee = await TenantFree.findOne();
  if (!applicationFee) {
    applicationFee = await TenantFree.create({ applicationFee: 20 });
  }
  return applicationFee;
};

const updateApplicationFee = async (payload: Partial<ITenantFree>) => {
  const applicationFee = await TenantFree.findOneAndUpdate(
    {},
    { $set: payload },
    { new: true },
  );
  return applicationFee;
};

export const tenantFreeService = {
  getApplicationFee,
  updateApplicationFee,
};
