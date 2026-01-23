import AppError from '../../error/appError';
import { IOption } from '../../helper/pagenation';
import pagination from '../../helper/pagenation';
import AdminTracker from './admintracker.model';

const getallAdminTracker = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['action', 'model', 'description'];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await AdminTracker.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any)
    .populate('adminId')
    .populate('targetId');

  const total = await AdminTracker.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getSingleAdminTracker = async (id: string) => {
  const result = await AdminTracker.findById(id)
    .populate('adminId')
    .populate('targetId');
  if (!result) {
    throw new AppError(404, 'Admin Tracker not found');
  }
  return result;
};

const deleteAdminTracker = async (id: string) => {
  const result = await AdminTracker.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(404, 'Admin Tracker not found');
  }
  return result;
};

export const adminTrackerService = {
  getallAdminTracker,
  getSingleAdminTracker,
  deleteAdminTracker,
};
