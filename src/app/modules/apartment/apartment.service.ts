import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import AdminTracker from '../admintracker/admintracker.model';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IApartment } from './apartment.interface';
import Apartment from './apartment.model';

const createApartment = async (
  ownerId: string,
  payload: IApartment,
  images?: Express.Multer.File[],
  videos?: Express.Multer.File[],
) => {
  const user = await User.findById(ownerId);
  if (!user) throw new AppError(404, 'user not found');

  if (user.role === userRole.admin || user.role === userRole.superadmin) {
    payload.status = 'approve';
  }
  if (images && images.length > 0) {
    const uploadImage = await Promise.all(
      images.map(async (image) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(image);
        return secure_url;
      }),
    );
    payload.images = uploadImage;
  }

  if (videos && videos.length > 0) {
    const uploadVideo = await Promise.all(
      videos.map(async (video) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(video);
        return secure_url;
      }),
    );
    payload.videos = uploadVideo;
  }

  payload.ownerId = user._id;

  const result = await Apartment.create(payload);
  if (!result) throw new AppError(400, 'apartment is not create');
  return result;
};

const getAllApartment = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const searchableFields = [
    'title',
    'description',
    'aboutListing',
    'address.street',
    'address.city',
    'address.state',
    'address.zipCode',
    'amenities',
    'status',
    'day',
    'packageTracking',
    'keyExchangeInfo',
    'inspectionStatus',
    'currentStatus',
    'unitId',
  ];

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

  const result = await Apartment.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);

  const total = await Apartment.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const singleApartment = async (id: string) => {
  const result = await Apartment.findById(id);
  if (!result) throw new AppError(404, 'apartment not found');
  return result;
};

const updateApartment = async (
  id: string,
  payload: Partial<IApartment>,
  images?: Express.Multer.File[],
  videos?: Express.Multer.File[],
) => {
  if (images && images.length > 0) {
    const uploadImage = await Promise.all(
      images.map(async (image) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(image);
        return secure_url;
      }),
    );
    payload.images = uploadImage;
  }

  if (videos && videos.length > 0) {
    const uploadVideo = await Promise.all(
      videos.map(async (video) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(video);
        return secure_url;
      }),
    );
    payload.videos = uploadVideo;
  }

  const result = await Apartment.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, 'apartment not found');
  return result;
};

const deleteApartment = async (id: string) => {
  const result = await Apartment.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'apartment not found');
  return result;
};

const getAllApartmentGroupByDay = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const searchableFields = [
    'title',
    'description',
    'aboutListing',
    'address.street',
    'address.city',
    'address.state',
    'address.zipCode',
    'amenities',
    'status',
    'day',
    'packageTracking',
    'keyExchangeInfo',
    'inspectionStatus',
    'currentStatus',
    'unitId',
  ];

  const andCondition: any[] = [];

  // Search term
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => {
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
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  // Group by Day
  const result = await Apartment.aggregate([
    { $match: whereCondition },
    { $sort: { [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1 } },
    {
      $group: {
        _id: '$day',
        apartments: { $push: '$$ROOT' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await Apartment.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateApartmentStatus = async (
  id: string,
  payload: { status: 'approve' | 'denied' },
) => {
  const result = await Apartment.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, 'Apartment not found');
  return result;
};

// my apartment-------------------

// Get All My Apartments
const getMyApartments = async (
  ownerId: string,
  params: any,
  options: IOption,
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const searchableFields = [
    'title',
    'description',
    'aboutListing',
    'address.street',
    'address.city',
    'address.state',
    'address.zipCode',
    'amenities',
    'status',
    'day',
    'packageTracking',
    'keyExchangeInfo',
    'inspectionStatus',
    'currentStatus',
    'unitId',
  ];

  const andCondition: any[] = [];

  // Search term
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => {
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
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Apartment.find({ ownerId, ...whereCondition })
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);
  const total = await Apartment.countDocuments({ ownerId, ...whereCondition });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get Single Apartment (own)
const getMySingleApartment = async (
  ownerId: string,
  apartmentId: string,
): Promise<IApartment | null> => {
  const apartment = await Apartment.findOne({ _id: apartmentId, ownerId });
  if (!apartment) {
    throw new AppError(404, 'Apartment not found or not yours');
  }
  return apartment;
};

// Update Apartment (own)
const updateMyApartment = async (
  ownerId: string,
  apartmentId: string,
  payload: Partial<IApartment>,
  images?: Express.Multer.File[],
  videos?: Express.Multer.File[],
) => {
  const apartment = await Apartment.findOne({ _id: apartmentId, ownerId });
  if (!apartment) {
    throw new AppError(404, 'Apartment not found or not yours');
  }

  if (images && images.length > 0) {
    const uploadImage = await Promise.all(
      images.map(async (image) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(image);
        return secure_url;
      }),
    );
    payload.images = uploadImage;
  }

  if (videos && videos.length > 0) {
    const uploadVideo = await Promise.all(
      videos.map(async (video) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(video);
        return secure_url;
      }),
    );
    payload.videos = uploadVideo;
  }

  const updated = await Apartment.findByIdAndUpdate(apartmentId, payload, {
    new: true,
    runValidators: true,
  });
  return updated;
};

// Delete Apartment (own)
const deleteMyApartment = async (ownerId: string, apartmentId: string) => {
  const apartment = await Apartment.findOne({ _id: apartmentId, ownerId });
  if (!apartment) {
    throw new AppError(404, 'Apartment not found or not yours');
  }

  await Apartment.findByIdAndDelete(apartmentId);
  return { message: 'Apartment deleted successfully' };
};

const getAllApartmentLocations = async () => {
  const locations = await Apartment.aggregate([
    {
      $group: {
        _id: '$address.city',
      },
    },
    {
      $project: {
        _id: 0,
        city: '$_id',
      },
    },
    {
      $sort: { city: 1 },
    },
  ]);

  return locations
    .filter((loc) => loc.city) // null/empty remove
    .map((loc) => loc.city);
};

const assasintLandlord = async (
  adminIs: string,
  landlordId: string,
  apartmentId: string,
) => {
  const user = await User.findById(adminIs);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const landlord = await User.findById(landlordId);
  if (!landlord) {
    throw new AppError(404, 'Landlord not found');
  }

  if (!landlord.isSubscription) {
    throw new AppError(400, 'Landlord is not a subscription user');
  }

  const apartment = await Apartment.findById(apartmentId);
  if (!apartment) {
    throw new AppError(404, 'Apartment not found');
  }

  const addLandlord = await Apartment.findByIdAndUpdate(
    apartmentId,
    {
      $addToSet: { assasintLandlordId: landlordId },
    },
    { new: true },
  );

  await AdminTracker.create({
    adminId: user._id,
    action: 'add',
    model: 'Apartment',
    targetId: apartmentId,
    description: 'Landlord added to apartment',
  });

  return addLandlord;
};

const removeLandlord = async (
  adminIs: string,
  landlordId: string,
  apartmentId: string,
) => {
  const user = await User.findById(adminIs);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const landlord = await User.findById(landlordId);
  if (!landlord) {
    throw new AppError(404, 'Landlord not found');
  }

  const apartment = await Apartment.findById(apartmentId);
  if (!apartment) {
    throw new AppError(404, 'Apartment not found');
  }

  const removeLandlord = await Apartment.findByIdAndUpdate(
    apartmentId,
    {
      $pull: { assasintLandlordId: landlordId },
    },
    { new: true },
  );

  await AdminTracker.create({
    adminId: user._id,
    action: 'remove',
    model: 'Apartment',
    targetId: apartmentId,
    description: 'Landlord removed from apartment',
  });

  return removeLandlord;
};

const showAssasintLandlordApartment = async (
  landlordId: string,
  params: any,
  options: IOption,
) => {
  const user = await User.findById(landlordId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const searchableFields = [
    'title',
    'description',
    'aboutListing',
    'address.street',
    'address.city',
    'address.state',
    'address.zipCode',
    'amenities',
    'status',
    'day',
  ];

  const andCondition: any[] = [];

  // Search term
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => {
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
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  andCondition.push({
    assasintLandlordId: landlordId,
  });

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Apartment.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);
  const total = await Apartment.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const assasintBrokers = async (
  adminIs: string,
  brokerId: string,
  apartmentId: string,
) => {
  const user = await User.findById(adminIs);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const broker = await User.findById(brokerId);
  if (!broker) {
    throw new AppError(404, 'Broker not found');
  }

  const apartment = await Apartment.findById(apartmentId);
  if (!apartment) {
    throw new AppError(404, 'Apartment not found');
  }

  const addBroker = await Apartment.findByIdAndUpdate(
    apartmentId,
    {
      $addToSet: { assasintBrokerId: brokerId },
    },
    { new: true },
  );

  await AdminTracker.create({
    adminId: user._id,
    action: 'add',
    model: 'Apartment',
    targetId: apartmentId,
    description: 'Broker added to apartment',
  });

  return addBroker;
};

const removeBroker = async (
  adminIs: string,
  brokerId: string,
  apartmentId: string,
) => {
  const user = await User.findById(adminIs);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const broker = await User.findById(brokerId);
  if (!broker) {
    throw new AppError(404, 'Broker not found');
  }

  const apartment = await Apartment.findById(apartmentId);
  if (!apartment) {
    throw new AppError(404, 'Apartment not found');
  }

  const removeBroker = await Apartment.findByIdAndUpdate(
    apartmentId,
    {
      $pull: { assasintBrokerId: brokerId },
    },
    { new: true },
  );

  await AdminTracker.create({
    adminId: user._id,
    action: 'remove',
    model: 'Apartment',
    targetId: apartmentId,
    description: 'Broker removed from apartment',
  });

  return removeBroker;
};

const showAssasintBrokerApartment = async (
  brokerId: string,
  params: any,
  options: IOption,
) => {
  const user = await User.findById(brokerId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const searchableFields = [
    'title',
    'description',
    'aboutListing',
    'address.street',
    'address.city',
    'address.state',
    'address.zipCode',
    'amenities',
    'status',
    'day',
  ];

  const andCondition: any[] = [];

  // Search term
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => {
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
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  andCondition.push({
    assasintBrokerId: brokerId,
  });

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Apartment.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);
  const total = await Apartment.countDocuments(whereCondition);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const createNote = async (
  userId: string,
  apartmentId: string,
  note: string,
) => {
  const apartment = await Apartment.findById(apartmentId);
  console.log(apartment);
  if (!apartment) {
    throw new AppError(404, 'Apartment not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.role === userRole.broker) {
    if (!apartment.assasintBrokerId?.includes(user._id)) {
      throw new AppError(404, 'You are not authorized to add note');
    }
  }

  const newNote = {
    note,
    noteCreate: user._id,
  };

  apartment.notes.push(newNote);

  await apartment.save();

  if (user.role === userRole.admin) {
    await AdminTracker.create({
      adminId: user._id,
      action: 'add',
      model: 'Apartment',
      targetId: apartmentId,
      description: 'Note added to apartment',
    });
  }

  return apartment;
};

export const apartmentService = {
  createApartment,
  getAllApartment,
  singleApartment,
  updateApartment,
  deleteApartment,
  getAllApartmentGroupByDay,
  updateApartmentStatus,
  getMyApartments,
  getMySingleApartment,
  updateMyApartment,
  deleteMyApartment,
  getAllApartmentLocations,
  assasintLandlord,
  removeLandlord,
  showAssasintLandlordApartment,
  assasintBrokers,
  removeBroker,
  showAssasintBrokerApartment,
  createNote,
};
