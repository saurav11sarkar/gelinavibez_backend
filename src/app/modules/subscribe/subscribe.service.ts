import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import sendMailer from '../../helper/sendMailer';
import { ISubscribe } from './subscribe.interface';
import Subscribe from './subscribe.model';

const createSubscrube = async (payload: ISubscribe) => {
  const result = await Subscribe.create(payload);
  return result;
};
const getAllSubscribe = async (params: any, options: IOption) => {
  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const addCondition: any[] = [];
  const searchableFields = ['firstName', 'lastName', 'email', 'phone'];
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
  const result = await Subscribe.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit);

  const total = await Subscribe.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getSingleSubscribe = async (id: string) => {
  const result = await Subscribe.findById(id);
  return result;
};
const updateSubscribe = async (id: string, payload: Partial<ISubscribe>) => {
  const result = await Subscribe.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
const deleteSubscribe = async (id: string) => {
  const result = await Subscribe.findByIdAndDelete(id);
  return result;
};

const broadcastNewsletter = async (payload: {
  subject?: string;
  html?: string;
}) => {
  const { subject, html } = payload;

  if (!subject?.trim() || !html?.trim()) {
    throw new AppError(400, 'Subject and HTML content are required');
  }

  const subscribers = await Subscribe.find();
  if (!subscribers.length) {
    throw new AppError(404, 'No newsletter subscribers found');
  }

  await Promise.all(
    subscribers.map((sub) =>
      sendMailer(sub.email, subject, html).catch((err) =>
        console.error(`❌ Failed to send email to ${sub.email}:`, err),
      ),
    ),
  );

  return { sentCount: subscribers.length };
};

export const subscribeService = {
  createSubscrube,
  getAllSubscribe,
  getSingleSubscribe,
  updateSubscribe,
  deleteSubscribe,
  broadcastNewsletter,
};
