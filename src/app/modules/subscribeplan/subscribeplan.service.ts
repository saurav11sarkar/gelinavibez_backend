import Stripe from 'stripe';
import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import AdminTracker from '../admintracker/admintracker.model';
import User from '../user/user.model';
import { ISubscribePlan } from './subscribeplan.interface';
import SubscribePlan from './subscribeplan.model';
import config from '../../config';
import { Payment } from '../payment/payment.model';

const createSubscribePlan = async (userId: string, payload: ISubscribePlan) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const result = await SubscribePlan.create({ ...payload, user: userId });

  await AdminTracker.create({
    adminId: user._id,
    action: 'update',
    model: 'SubscribePlan',
    targetId: result._id,
    description: 'SubscribePlan created',
  });
  return result;
};

const getAllSubscribePlan = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const addCondition: any[] = [];
  const searchableFields = ['name', 'type', 'features', 'status'];
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
  const result = await SubscribePlan.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email profileImage role');

  const total = await SubscribePlan.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getSingleSubscribePlan = async (id: string) => {
  const result = await SubscribePlan.findById(id);
  if (!result) throw new AppError(404, 'SubscribePlan not found');
  return result;
};

const updateSubscribePlan = async (
  userId: string,
  id: string,
  payload: ISubscribePlan,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const result = await SubscribePlan.findByIdAndUpdate(id, payload, {
    new: true,
  });

  await AdminTracker.create({
    adminId: user._id,
    action: 'update',
    model: 'SubscribePlan',
    targetId: id,
    description: 'SubscribePlan updated',
  });
  return result;
};

const deleteSubscribePlan = async (userId: string, id: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const result = await SubscribePlan.findByIdAndDelete(id);

  await AdminTracker.create({
    adminId: user._id,
    action: 'delete',
    model: 'SubscribePlan',
    targetId: id,
    description: 'SubscribePlan deleted',
  });
  return result;
};

const stripe = new Stripe(config.stripe.secretKey!);

const paySubscribePlan = async (userId: string, subscribePlanId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const subscribePlan = await SubscribePlan.findById(subscribePlanId);
  if (!subscribePlan) throw new AppError(404, 'SubscribePlan not found');

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: subscribePlan.price * 100,
          product_data: {
            name: subscribePlan.name,
            description: subscribePlan.features || 'description',
          },
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,
    success_url: `${config.frontendUrl}/plans-success`,
    cancel_url: `${config.frontendUrl}/plans-cancel`,
    metadata: {
      userId: user._id.toString(),
      subscribePlanId: subscribePlan._id.toString(),
      paymentType: 'subscribePlan',
      type: subscribePlan.type,
      amount: subscribePlan.price.toFixed(2),
    },
  });

  await Payment.create({
    user: user._id,
    subscribePlanId: subscribePlan._id,
    paymentType: 'subscribePlan',
    amount: subscribePlan.price.toFixed(2),
    stripeSessionId: session.id,
    status: 'pending',
  });

  return { url: session.url, sessionId: session.id };
};

export const SubscribePlanService = {
  createSubscribePlan,
  getAllSubscribePlan,
  getSingleSubscribePlan,
  updateSubscribePlan,
  deleteSubscribePlan,
  paySubscribePlan
};
