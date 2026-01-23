import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import sendMailer from '../../helper/sendMailer';
import AdminTracker from '../admintracker/admintracker.model';

import { IUser } from './user.interface';
import User from './user.model';

const createUser = async (
  userId: string,
  payload: IUser,
  ipAddress: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }

  const generatPassword = Math.random().toString(36).slice(-8);
  payload.password = generatPassword;
  const result = await User.create(payload);

  await AdminTracker.create({
    adminId: user._id,
    action: 'create',
    model: 'User',
    targetId: result._id,
    description: 'User created',
    ipAddress: ipAddress || 'unknown',
  });

  await sendMailer(
    payload.email,
    'User Created',
    `User created successfully email: ${payload.email} password: ${generatPassword}`,
  );

  return result;
};

const getAllUser = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'name',
    'email',
    'role',
    'firstName',
    'lastName',
    'verified',
    'approvedLandlordBrokerAdmin'
  ];

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

  const result = await User.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  const total = await User.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const getUserById = async (id: string) => {
  const result = await User.findById(id);
  return result;
};

const updateUserById = async (
  userId: string,
  id: string,
  payload: IUser,
  file?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }
  if (file) {
    const uploadProfile = await fileUploader.uploadToCloudinary(file);
    if (!uploadProfile?.secure_url) {
      throw new AppError(400, 'Failed to upload profile image');
    }
    payload.profileImage = uploadProfile.secure_url;
  }
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  await AdminTracker.create({
    adminId: user._id,
    action: 'update',
    model: 'User',
    targetId: result?._id,
    description: 'User updated',
  });
  return result;
};

const deleteUserById = async (userId: string, id: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }
  const result = await User.findByIdAndDelete(id);

  await AdminTracker.create({
    adminId: user._id,
    action: 'delete',
    model: 'User',
    targetId: result?._id,
    description: 'User deleted',
  });
  return result;
};

const profile = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(404, 'User not found');
  }
  return result;
};

const updateProfile = async (
  userId: string,
  payload: IUser,
  file?: Express.Multer.File,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }
  if (file) {
    const uploadProfile = await fileUploader.uploadToCloudinary(file);
    if (!uploadProfile?.secure_url) {
      throw new AppError(400, 'Failed to upload profile image');
    }
    payload.profileImage = uploadProfile.secure_url;
  }
  const result = await User.findByIdAndUpdate(user._id, payload, { new: true });
  return result;
};

const requestAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }
  const result = await User.findByIdAndUpdate(
    userId,
    { requestAdmin: true },
    { new: true },
  );

  return result;
};

const allRequestAdmin = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = ['firstName', 'lastName', 'email', 'role'];

  //  Search condition
  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  //  Filters (role, verified, etc.)
  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Show users who are either "admin" OR have requested admin access
  const whereCondition =
    andCondition.length > 0
      ? {
          $and: [
            ...andCondition,
            { $or: [{ role: 'admin' }, { requestAdmin: true }] },
          ],
        }
      : { $or: [{ role: 'admin' }, { requestAdmin: true }] };

  // Fetch results
  const result = await User.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  // Total count
  const total = await User.countDocuments(whereCondition);

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const updateAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { role: 'admin', requestAdmin: false },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Something went wrong');
  }

  return result;
};

const deleteAdmin = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { role: 'user', requestAdmin: false },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Something went wrong');
  }

  return result;
};

const updateAccessRoutes = async (userId: string, accessRoutes: string[]) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { accessRoutes },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Something went wrong');
  }

  return result;
};

const approvedLandlordBrokerAdmin = async (userId: string, id: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }

  const userById = await User.findById(id);
  if (!userById) {
    throw new AppError(400, 'User does not exist');
  }

  const result = await User.findByIdAndUpdate(
    id,
    { approvedLandlordBrokerAdmin: 'approved' },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Something went wrong');
  }

  await AdminTracker.create({
    adminId: user._id,
    action: 'update',
    model: 'User',
    targetId: result?._id,
    description: `User approved ${userById.role}`,
  });

  return result;
};
const rejectedLandlordBrokerAdmin = async (userId: string, id: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(400, 'User does not exist');
  }

  const userById = await User.findById(id);
  if (!userById) {
    throw new AppError(400, 'User does not exist');
  }

  const result = await User.findByIdAndUpdate(
    id,
    { approvedLandlordBrokerAdmin: 'rejected' },
    { new: true },
  );

  if (!result) {
    throw new AppError(400, 'Something went wrong');
  }

  await AdminTracker.create({
    adminId: user._id,
    action: 'update',
    model: 'User',
    targetId: result?._id,
    description: `User rejected ${userById.role}`,
  });

  return result;
};

export const userService = {
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  profile,
  requestAdmin,
  updateAdmin,
  allRequestAdmin,
  deleteAdmin,
  updateAccessRoutes,
  updateProfile,
  approvedLandlordBrokerAdmin,
  rejectedLandlordBrokerAdmin,
};
