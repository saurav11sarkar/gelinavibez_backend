import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { Payment } from './payment.model';

const getAllPayment = async (params: any, options: IOption) => {
  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const addCondition: any[] = [];
  const searchableFields = [
    'tenantName',
    'tenantEmail',
    'status',
    'stripeSessionId',
    'stripePaymentIntentId',
  ];
  if (searchTerm) {
    addCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filterData).length) {
    addCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = addCondition.length > 0 ? { $and: addCondition } : {};
  const result = await Payment.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email profileImage role');

  const total = await Payment.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};


const getMyAllPayment = async (userId:string,params: any, options: IOption) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const addCondition: any[] = [];
  const searchableFields = [
    'tenantName',
    'tenantEmail',
    'status',
    'stripeSessionId',
    'stripePaymentIntentId',
  ];
  if (searchTerm) {
    addCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filterData).length) {
    addCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = addCondition.length > 0 ? { $and: addCondition } : {};
  const result = await Payment.find({...whereCondition, user: userId})
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email profileImage role');

  const total = await Payment.countDocuments({...whereCondition, user: userId});
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const singlePayment = async (id: string) => {
  const result = await Payment.findById(id).populate(
    'user',
    'firstName lastName email profileImage role',
  );
  return result;
};

const updatePayment = async (id: string, data: any) => {
  const result = await Payment.findByIdAndUpdate(id, data, { new: true });
  return result;
};

const deletePayment = async (id: string) => {
  const result = await Payment.findByIdAndDelete(id);
  return result;
};

export const paymentService = {
  getAllPayment,
  singlePayment,
  updatePayment,
  deletePayment,
  getMyAllPayment
};
