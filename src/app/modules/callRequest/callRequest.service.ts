import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import User from '../user/user.model';
import { ICallRequest } from './callRequest.interface';
import CallRequest from './callRequest.model';

const createCallRequest = async (userId: string, payload: ICallRequest) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(400, 'User not found');
  const result = await CallRequest.create({ ...payload, createBy: user._id });
  return result;
};

const getAllCallRequest = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const searchableFields = ['firstName', 'lastName', 'email', 'phone'];

  const andCondition: any[] = [];

  // Search term
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => {
        // Special handling for array field "amenities"
        if (field === 'amenities') {
          return {
            [field]: { $elemMatch: { $regex: searchTerm, $options: 'i' } },
          };
        }
        return { [field]: { $regex: searchTerm, $options: 'i' } };
      }),
    });
  }

  // Filters
  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => {
        return { [field]: value };
      }),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await CallRequest.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit)
    .populate('visiting', 'title')
    .populate('createBy');

  const totle = await CallRequest.countDocuments(whereCondition);
  return {
    meta: { totle, page, limit },
    data: result,
  };
};

const singleCallRequest = async (id: string) => {
  const result = await CallRequest.findById(id)
    .populate('visiting', 'title')
    .populate('createBy');
  if (!result) throw new AppError(400, 'Call Request not found');
  return result;
};

const updateCallRequest = async (
  id: string,
  payload: Partial<ICallRequest>,
) => {
  const result = await CallRequest.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) throw new AppError(400, 'Call Request not found');
  return result;
};

const deleteCallRequest = async (id: string) => {
  const result = await CallRequest.findByIdAndDelete(id);
  if (!result) throw new AppError(400, 'Call Request not found');
  return result;
};

export const callRequestServices = {
  createCallRequest,
  getAllCallRequest,
  singleCallRequest,
  updateCallRequest,
  deleteCallRequest
};
