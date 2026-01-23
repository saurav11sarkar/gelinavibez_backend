import Stripe from 'stripe';
import config from '../../config';
import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
// import sendMailer from '../../helper/sendMailer';
import Extermination from '../extermination/extermination.model';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IContractor } from './contractor.interface';
import Contractor from './contractor.model';
import AdminTracker from '../admintracker/admintracker.model';
import { Payment } from '../payment/payment.model';
import { cleanRegex } from 'zod/v4/core/util.cjs';

// const createContractor = async (
//   payload: IContractor,
//   file?: Express.Multer.File,
// ) => {
//   // Upload contractor image if provided
//   if (file) {
//     const uploaded = await fileUploader.uploadToCloudinary(file);
//     payload.image = uploaded.secure_url;
//   }

//   // Create contractor in DB
//   const contractor = await Contractor.create(payload);
//   if (!contractor) {
//     throw new AppError(400, 'Contractor not created');
//   }

//   // Generate random password for contractor login
//   const generatedPassword = `${contractor.name.split(' ')[0].toLowerCase()}${Math.floor(
//     Math.random() * 10000 + 1,
//   )}`;

//   // Create a linked user account
//   const newUser = new User({
//     firstName: contractor.name,
//     lastName: '',
//     email: contractor.email,
//     phone: contractor.number,
//     role: 'contractor',
//     password: generatedPassword,
//     profileImage: contractor.image,
//   });

//   await newUser.save();

//   // Send email with credentials
//   await sendMailer(
//     contractor.email,
//     'Contractor Account Created',
//     `
//       <h2>Welcome, ${contractor.name}</h2>
//       <p>Your contractor account has been created successfully.</p>
//       <p><strong>Login Email:</strong> ${contractor.email}</p>
//       <p><strong>Password:</strong> ${generatedPassword}</p>
//       <p>You can now log in using your credentials.</p>
//       <p>Thank you for joining us!</p>
//     `,
//   );

//   return contractor;
// };

const createContractor = async (
  userId: string,
  payload: IContractor,
  files?: Express.Multer.File[],
  videos?: Express.Multer.File[],
) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) throw new AppError(404, 'User not found');

  if (files?.length) {
    const uploadedImages = await Promise.all(
      files.map((file) => fileUploader.uploadToCloudinary(file)),
    );
    payload.images = uploadedImages.map((file) => file.secure_url);
  }

  if (videos?.length) {
    const uploadedVideos = await Promise.all(
      videos.map((file) => fileUploader.uploadToCloudinary(file)),
    );
    payload.videos = uploadedVideos.map((file) => file.secure_url);
  }

  const result = await Contractor.create({
    ...payload,
    user: existingUser._id,
  });

  return result;
};

const getAllContractor = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: any[] = [];
  const searchableFields = [
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
  ];
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Contractor.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit)
    .populate('service')
    .populate(
      'assigningContractor',
      'firstName lastName email phone profileImage',
    );

  if (!result) throw new AppError(400, 'Failed to get contact');
  const total = await Contractor.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getSingleContractor = async (id: string) => {
  const result = await Contractor.findById(id).populate('service');
  if (!result) throw new AppError(400, 'Failed to get contact');
  return result;
};

const updateContractor = async (
  id: string,
  payload: Partial<IContractor>,
  files?: Express.Multer.File[],
  videos?: Express.Multer.File[],
) => {
  if (files?.length) {
    const uploaded = await Promise.all(
      files.map((file) => fileUploader.uploadToCloudinary(file)),
    );
    payload.images = uploaded.map((file) => file.secure_url);
  }

  if (videos?.length) {
    const uploaded = await Promise.all(
      videos.map((file) => fileUploader.uploadToCloudinary(file)),
    );
    payload.videos = uploaded.map((file) => file.secure_url);
  }
  const result = await Contractor.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) throw new AppError(400, 'Failed to update contact');
  return result;
};

const deleteContractor = async (id: string) => {
  const contractor = await Contractor.findById(id);
  if (!contractor) throw new AppError(404, 'Contractor not found');

  const deletedContractor = await Contractor.findByIdAndDelete(id);
  if (!deletedContractor)
    throw new AppError(400, 'Failed to delete contractor');

  await User.findOneAndDelete({
    email: contractor.email,
    role: 'contractor',
  });

  return deletedContractor;
};

// const getMyContractorAssignExtermination = async (
//   userId: string,
//   options: IOption,
// ) => {
//   const { page, limit, skip, sortBy, sortOrder } = pagination(options);
//   const user = await User.findById(userId);
//   if (!user) throw new AppError(404, 'User not found');

//   const contractor = await Contractor.findOne({ email: user.email });
//   if (!contractor)
//     throw new AppError(404, 'Contractor not found for this user');

//   const exterminations = await Extermination.find({
//     contractor: contractor._id,
//   })
//     .populate('user', 'firstName lastName email phone')
//     .sort({
//       [sortBy]: sortOrder,
//     } as any)
//     .skip(skip)
//     .limit(limit);

//   if (!exterminations) throw new AppError(400, 'Failed to get contact');

//   const total = await Extermination.countDocuments({
//     contractor: contractor._id,
//   });

//   return {
//     contractor,
//     exterminations,
//     meta: { total, page, limit },
//   };
// };

const getMyContractorAssignExtermination = async (
  userId: string,
  options: IOption,
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);

  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const contractor = await Contractor.findOne({ email: user.email });
  if (!contractor)
    throw new AppError(404, 'Contractor not found for this user');

  const exterminations = await Extermination.find({
    contractor: contractor._id,
  })
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'charges', // link to the charges collection
      select:
        'amount description status dueDate apartmentName serviceType isPayment',
      model: 'Charge', // explicitly tell mongoose which model to use
    })
    .lean(); // lean() returns plain JS objects instead of Mongoose documents

  const total = await Extermination.countDocuments({
    contractor: contractor._id,
  });

  return {
    contractor,
    exterminations,
    meta: { total, page, limit },
  };
};

const getAdminContractorAssignExtermination = async (
  userId: string,
  options: IOption,
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);

  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  let filter: any = {};

  // Contractor → only his exterminations
  if (user.role === 'contractor') {
    const contractor = await Contractor.findOne({ email: user.email });
    if (!contractor)
      throw new AppError(404, 'Contractor not found for this user');

    filter.contractor = contractor._id;
  }

  // Admin / Superadmin → see all exterminations
  else if (user.role === 'admin' || user.role === 'superadmin') {
    filter = {}; // no restriction
  }

  const exterminations = await Extermination.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'contractor',
      select: 'companyName name email number CompanyAddress image role',
      model: 'Contractor',
    })
    .populate({
      path: 'charges',
      select:
        'amount description status dueDate apartmentName serviceType isPayment',
    })
    .lean();

  const total = await Extermination.countDocuments(filter);

  return {
    role: user.role,
    exterminations,
    meta: { total, page, limit },
  };
};

// admin constractor assign request user
const addAdminContractorAssign = async (
  adminId: string,
  contractorId: string,
  assigningContractor: string,
) => {
  const admin = await User.findById(adminId);
  if (!admin) throw new AppError(404, 'Admin not found');

  const contractor = await Contractor.findById(contractorId);
  if (!contractor) throw new AppError(404, 'Contractor not found');

  const assignedUser = await User.findById(assigningContractor);
  if (!assignedUser) throw new AppError(404, 'User not found');

  if (assignedUser.role !== userRole.contractor) {
    throw new AppError(403, 'Only contractor role can be assigned');
  }

  const result = await Contractor.findByIdAndUpdate(
    contractorId,
    { assigningContractor: assignedUser._id },
    { new: true },
  ).populate(
    'assigningContractor',
    'firstName lastName email phone profileImage',
  );

  await AdminTracker.create({
    adminId: admin._id,
    action: 'add',
    model: 'Contractor',
    targetId: contractorId,
    description: 'Contractor assigned by admin',
  });

  return result;
};

const getMyAssignContractor = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
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

  andCondition.push({ assigningContractor: user._id });

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Contractor.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  const total = await Contractor.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const chargesContractor = async (
  userId: string,
  contractorId: string,
  charges: number,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const allowedRoles = [
    userRole.contractor,
    userRole.admin,
    userRole.superadmin,
  ];

  if (!allowedRoles.includes(user.role as any)) {
    throw new AppError(403, 'You are not allowed to update charges');
  }

  const contractor = await Contractor.findById(contractorId);
  if (!contractor) throw new AppError(404, 'Contractor not found');

  contractor.charges = charges;
  await contractor.save();

  if (user.role === userRole.admin) {
    await AdminTracker.create({
      adminId: user._id,
      action: 'update',
      model: 'Contractor',
      targetId: contractorId,
      description: 'Contractor charges updated',
    });
  }

  return contractor;
};

const getMyContractorService = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
    'status',
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

  andCondition.push({ user: user._id });

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Contractor.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  const total = await Contractor.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const allRequestCharge = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
    'status',
  ];

  andCondition.push({
    assigningContractor: { $exists: true, $ne: null },
    charges: { $exists: true, $ne: null },
    status: 'pending',
  });

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

  const result = await Contractor.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  const total = await Contractor.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const updateStatusAdmin = async (
  userId: string,
  constractorId: string,
  status: string,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  if (user.role !== userRole.admin && user.role !== userRole.superadmin)
    throw new AppError(403, 'Only admin or superadmin can update status');

  const contractor = await Contractor.findById(constractorId);
  if (!contractor) throw new AppError(404, 'Contractor not found');
  const result = await Contractor.findByIdAndUpdate(
    constractorId,
    { status },
    { new: true },
  );

  await AdminTracker.create({
    adminId: user._id,
    action: 'update',
    model: 'Contractor',
    targetId: constractorId,
    description: 'Contractor status updated',
  });
  return result;
};

const stripe = new Stripe(config.stripe.secretKey!);

/**
 * Contractor Stripe Express Account তৈরি করা
 */
const createContractorStripeAccount = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  if (user.role !== userRole.contractor)
    throw new AppError(403, 'Only contractors can create a Stripe account');

  // Stripe account create
  if (!user.stripeAccountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      business_type: 'individual',
      metadata: { contractorId: userId },
    });

    user.stripeAccountId = account.id;
    await user.save();
  }

  // Onboarding link তৈরি করা
  const accountLink = await stripe.accountLinks.create({
    account: user.stripeAccountId,
    refresh_url: `${config.frontendUrl}/connect/refresh`,
    return_url: `${config.frontendUrl}/stripe-account-success`,
    type: 'account_onboarding',
  });

  return {
    url: accountLink.url,
    message: 'Stripe onboarding link created successfully',
  };
};

/**
 * Contractor Dashboard Login Link
 */
const getStripeDashboardLink = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.stripeAccountId)
    throw new AppError(404, 'Stripe account not found');

  const loginLink = await stripe.accounts.createLoginLink(user.stripeAccountId);

  return {
    url: loginLink.url,
    message: 'Stripe dashboard link created successfully',
  };
};

const payContractorCharge = async (userId: string, constractorId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const contractor = await Contractor.findById(constractorId);
  if (!contractor) throw new AppError(404, 'Contractor not found');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: Number(contractor.charges ?? 0) * 100,
          product_data: {
            name: contractor.companyName,
            description: 'Contractor Charge',
          },
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,
    success_url: `${config.frontendUrl}/stripe-success`,
    cancel_url: `${config.frontendUrl}/stripe-cancel`,
    metadata: {
      userId: user._id.toString(),
      contractorId: contractor._id.toString(),
      paymentType: 'contractorCharge',
      type: contractor.companyName,
      amount: Number(contractor.charges ?? 0).toString(),
    },
  } as any);

  await Payment.create({
    user: user._id,
    contractor: contractor._id,
    paymentType: 'contractorCharge',
    amount: Number(contractor.charges ?? 0).toFixed(2),
    stripeSessionId: session.id,
    status: 'pending',
  });

  return { url: session.url, sessionId: session.id };
};

export const contractorService = {
  createContractor,
  getAllContractor,
  getSingleContractor,
  updateContractor,
  deleteContractor,
  getMyContractorAssignExtermination,
  getAdminContractorAssignExtermination,
  addAdminContractorAssign,
  getMyAssignContractor,
  chargesContractor,
  updateStatusAdmin,
  getMyContractorService,
  allRequestCharge,

  createContractorStripeAccount,
  getStripeDashboardLink,
  payContractorCharge,
};
