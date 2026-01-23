import config from '../../config';
import Stripe from 'stripe';
import Tenant from './tenant.model';
import { Payment } from '../payment/payment.model';
import User from '../user/user.model';
import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import sendMailer from '../../helper/sendMailer';
import { ITenant } from './tanant.interface';
import pagination, { IOption } from '../../helper/pagenation';
import TenantFree from '../tenantFree/tenantFree.model';
import mongoose from 'mongoose';
import { userRole } from '../user/user.constant';
import AdminTracker from '../admintracker/admintracker.model';
import Apartment from '../apartment/apartment.model';

const stripe = new Stripe(config.stripe.secretKey!);

// Tenant create + Payment create + Stripe session
const createTenant = async (
  userId: string,
  payload: Partial<ITenant>,
  files?: Record<string, Express.Multer.File[]>,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  // file upload
  if (files) {
    payload.uploads = {};
    const allowedUploadKeys = [
      'idCard',
      'ssnDoc',
      'voucherDoc',
      'incomeDoc',
    ] as const;
    for (const key of Object.keys(files)) {
      if (allowedUploadKeys.includes(key as any)) {
        const file = files[key][0];
        const uploaded = await fileUploader.uploadToCloudinary(file);
        (payload.uploads as any)[key] = uploaded.secure_url;
      }
    }
  }

  const setting = await TenantFree.findOne();
  const adminFee = setting?.applicationFee || 20;

  // Tenant create
  const tenant = await Tenant.create({ ...payload, createBy: user._id });

  // Stripe checkout session (manual capture)
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    payment_intent_data: {
      capture_method: 'manual',
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: adminFee * 100,
          product_data: {
            name: 'Tenant Fee',
            description: 'Tenant application fee',
          },
        },
        quantity: 1,
      },
    ],
    customer_email: tenant.email,
    success_url: `${config.frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontendUrl}/payment-cancel`,
    metadata: {
      userId: user._id.toString(),
      tenantId: tenant._id.toString(),
      paymentType: 'applicationFee',
      type: user.firstName,
      amount: Number(adminFee).toString(),
    },
  });

  // Payment create
  const payment = await Payment.create({
    tenantId: tenant._id,
    tenantName: `${tenant.firstName} ${tenant.lastName}`,
    tenantEmail: tenant.email,
    paymentType: 'applicationFee',
    amount: adminFee,
    user: user._id,
  });

  // Stripe session ID save
  payment.stripeSessionId = session.id;
  await payment.save();

  tenant.paymentId = payment._id;
  await tenant.save();

  // Email notify user
  await sendMailer(
    tenant.email,
    'Application Received',
    `<p>Hi ${tenant.firstName + ' ' + tenant.lastName}, your application is received and pending admin approval.</p>`,
  );

  return { tenant, stripeSessionUrl: session.url };
};

// // Admin approve tenant (capture payment)
// const approveTenant = async (tenantId: string, userId: string) => {
//   const user = await User.findById(userId);
//   if (!user) throw new AppError(404, 'User not found');

//   if(user.role === userRole.landlord){

//   }

//   const tenant = await Tenant.findById(tenantId).populate('paymentId');
//   if (!tenant) throw new AppError(404, 'Tenant not found');

//   const payment = await Payment.findById(tenant.paymentId);
//   if (!payment) throw new AppError(404, 'Payment not found');

//   if (payment.stripePaymentIntentId)
//     await stripe.paymentIntents.capture(payment.stripePaymentIntentId);

//   tenant.status = 'approved';
//   payment.status = 'approved';
//   await tenant.save();
//   await payment.save();

//   await sendMailer(
//     tenant.email,
//     'Application Approved',
//     `<p>Hi ${tenant.firstName + ' ' + tenant.lastName}, your application is approved.</p>`,
//   );

//   return { message: 'Tenant approved and payment captured' };
// };

// // Admin deny tenant (refund payment)
// const denyTenant = async (tenantId: string, userId: string) => {
//   const tenant = await Tenant.findById(tenantId).populate('paymentId');
//   if (!tenant) throw new AppError(404, 'Tenant not found');

//   const payment = await Payment.findById(tenant.paymentId);
//   if (!payment) throw new AppError(404, 'Payment not found');

//   if (payment.stripePaymentIntentId)
//     await stripe.refunds.create({
//       payment_intent: payment.stripePaymentIntentId,
//     });

//   tenant.status = 'denied';
//   payment.status = 'denied';
//   await tenant.save();
//   await payment.save();

//   await sendMailer(
//     tenant.email,
//     'Application Denied',
//     `<p>Hi ${tenant.firstName + ' ' + tenant.lastName}, your application is denied.</p>`,
//   );

//   return { message: 'Tenant denied and payment refunded' };
// };

const approveTenant = async (userId: string, tenantId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const tenant = await Tenant.findById(tenantId)
    .populate('paymentId')
    .populate('apartmentId');
  if (!tenant) throw new AppError(404, 'Tenant not found');

  const apartment = tenant.apartmentId as any;

  const isAllowed =
    user.role === userRole.admin ||
    user.role === userRole.superadmin ||
    (user.role === userRole.landlord &&
      (apartment.ownerId.toString() === userId ||
        apartment.assasintLandlordId.some(
          (id: any) => id.toString() === userId,
        )));

  if (!isAllowed)
    throw new AppError(403, 'You are not authorized to approve this tenant');

  const payment = tenant.paymentId as any;
  if (!payment) throw new AppError(404, 'Payment not found');

  if (payment.stripePaymentIntentId)
    await stripe.paymentIntents.capture(payment.stripePaymentIntentId);

  tenant.status = 'approved';
  payment.status = 'approved';
  await tenant.save();
  await payment.save();

  await sendMailer(
    tenant.email,
    'Application Approved',
    `<p>Hi ${tenant.firstName} ${tenant.lastName}, your application is approved.</p>`,
  );

  // Track admin action
  if (user.role === userRole.admin || user.role === userRole.superadmin) {
    await AdminTracker.create({
      adminId: user._id,
      action: 'approve',
      model: 'Tenant',
      targetId: tenant._id,
      description: `Tenant application approved: ${tenant.firstName} ${tenant.lastName}`,
    });
  }

  return { message: 'Tenant approved and payment captured' };
};

const denyTenant = async (userId: string, tenantId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const tenant = await Tenant.findById(tenantId)
    .populate('paymentId')
    .populate('apartmentId');
  if (!tenant) throw new AppError(404, 'Tenant not found');

  const apartment = tenant.apartmentId as any;

  const isAllowed =
    user.role === userRole.admin ||
    user.role === userRole.superadmin ||
    (user.role === userRole.landlord &&
      (apartment.ownerId.toString() === userId ||
        apartment.assasintLandlordId.some(
          (id: any) => id.toString() === userId,
        )));

  if (!isAllowed)
    throw new AppError(403, 'You are not authorized to deny this tenant');

  const payment = tenant.paymentId as any;
  if (!payment) throw new AppError(404, 'Payment not found');

  if (payment.stripePaymentIntentId)
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

  tenant.status = 'denied';
  payment.status = 'denied';
  await tenant.save();
  await payment.save();

  await sendMailer(
    tenant.email,
    'Application Denied',
    `<p>Hi ${tenant.firstName} ${tenant.lastName}, your application is denied.</p>`,
  );

  // Track admin action
  if (user.role === userRole.admin || user.role === userRole.superadmin) {
    await AdminTracker.create({
      adminId: user._id,
      action: 'deny',
      model: 'Tenant',
      targetId: tenant._id,
      description: `Tenant application denied: ${tenant.firstName} ${tenant.lastName}`,
    });
  }

  return { message: 'Tenant denied and payment refunded' };
};

const getAllTenantApplication = async (params: any, options: IOption) => {
  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const addCondition: any[] = [];
  const searchableFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'ssn',
    'status',
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
  const result = await Tenant.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit)
    .populate(
      'apartmentId',
      'title description aboutListing price bedrooms bathrooms squareFeet',
    )
    .populate('createBy', 'firstName lastName email profileImage role')
    .populate(
      'paymentId',
      'tenantId tenantName tenantEmail amount user status',
    );

  const total = await Tenant.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getMyAllTenantApplication = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const addCondition: any[] = [];
  const searchableFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'ssn',
    'status',
  ];

  if (searchTerm) {
    addCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
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

  const result = await Tenant.find({ ...whereCondition, createBy: user._id })
    .sort({ [sortBy || 'createdAt']: sortOrder || 'desc' } as any)
    .skip(skip)
    .limit(limit)
    .populate(
      'apartmentId',
      'title description aboutListing price bedrooms bathrooms squareFeet images',
    )
    .populate('createBy', 'firstName lastName email profileImage role');

  const total = await Tenant.countDocuments({
    ...whereCondition,
    createBy: user._id,
  });

  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getTenantApplication = async (tenantId: string) => {
  const tenant = await Tenant.findById(tenantId)
    .populate(
      'apartmentId',
      'title description aboutListing price bedrooms bathrooms squareFeet',
    )
    .populate('createBy', 'firstName lastName email profileImage role');
  if (!tenant) throw new AppError(404, 'Tenant not found');
  return tenant;
};

const updateTenantApplication = async (
  tenantId: string,
  payload: Partial<ITenant>,
  files?: Record<string, Express.Multer.File[]>,
) => {
  // file upload
  if (files) {
    payload.uploads = {};
    const allowedUploadKeys = [
      'idCard',
      'ssnDoc',
      'voucherDoc',
      'incomeDoc',
    ] as const;
    for (const key of Object.keys(files)) {
      if (allowedUploadKeys.includes(key as any)) {
        const file = files[key][0];
        const uploaded = await fileUploader.uploadToCloudinary(file);
        (payload.uploads as any)[key] = uploaded.secure_url;
      }
    }
  }
  const tenant = await Tenant.findByIdAndUpdate(tenantId, payload, {
    new: true,
  });
  if (!tenant) throw new AppError(404, 'Tenant not found');
  return tenant;
};

const deleteTenantApplication = async (tenantId: string) => {
  const tenant = await Tenant.findByIdAndDelete(tenantId);
  if (!tenant) throw new AppError(404, 'Tenant not found');
  return tenant;
};

const getMyAllTenantApplicationlandlords = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const addCondition: any[] = [];
  const searchableFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'ssn',
    'status',
  ];

  if (searchTerm) {
    addCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
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

  const whereCondition: any =
    addCondition.length > 0 ? { $and: addCondition } : {};

  // ====== Restrict by apartment assignment for assistant landlords ======
  if (user.role === userRole.landlord) {
    const apartments = await Apartment.find({
      assasintLandlordId: user._id,
    }).select('_id');

    const apartmentIds = apartments.map((apt) => apt._id);
    whereCondition.apartmentId = { $in: apartmentIds };
  }

  // Admin/Superadmin can see all tenants (no restriction)

  const result = await Tenant.find(whereCondition)
    .sort({ [sortBy || 'createdAt']: sortOrder || 'desc' } as any)
    .skip(skip)
    .limit(limit)
    .populate(
      'apartmentId',
      'title description aboutListing price bedrooms bathrooms squareFeet images',
    )
    .populate('createBy', 'firstName lastName email profileImage role');

  const total = await Tenant.countDocuments(whereCondition);

  return {
    meta: { total, page, limit },
    data: result,
  };
};

export const tenantService = {
  createTenant,
  approveTenant,
  denyTenant,
  getAllTenantApplication,
  getTenantApplication,
  updateTenantApplication,
  deleteTenantApplication,
  getMyAllTenantApplication,
  getMyAllTenantApplicationlandlords,
};
