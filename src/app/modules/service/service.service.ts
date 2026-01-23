import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { Iservice } from './service.interface';
import Service from './service.model';

const createService = async (userId: string, payload: Iservice) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User not found');
  }
  const service = await Service.findOne({ name: payload.name });
  if (service) {
    throw new AppError(400, 'Service already exists');
  }
  const result = await Service.create({ ...payload, createBy: user._id });
  return result;
};
const getAllService = async (params: any, options: IOption) => {
  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const addCondition: any[] = [];
  const searchableFields = ['name'];
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
  const result = await Service.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit);

  const total = await Service.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const singleService = async (id: string) => {
  const result = await Service.findById(id);
  return result;
};

const updateService = async (id: string, payload: Iservice) => {
  const result = await Service.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const defaultService = async (id: string) => {
  const result = await Service.findByIdAndDelete(id);
  return result;
};

export const serviceServices = {
  createService,
  getAllService,
  singleService,
  updateService,
  defaultService,
};
