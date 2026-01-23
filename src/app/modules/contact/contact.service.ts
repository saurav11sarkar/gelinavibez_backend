import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import { IContact } from './contact.interface';
import Contact from './contact.model';

const createContact = async (payload: IContact) => {
  const result = await Contact.create(payload);
  if (!result) throw new AppError(400, 'Failed to create contact');
  return result;
};

const getAllContact = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: any[] = [];
  const searchableFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'message',
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
  const result = await Contact.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit);

  if (!result) throw new AppError(400, 'Failed to get contact');
  const total = await Contact.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getSingleContact = async (id: string) => {
  const result = await Contact.findById(id);
  if (!result) throw new AppError(400, 'Failed to get contact');
  return result;
};

const updateContact = async (id: string, payload: Partial<IContact>) => {
  const result = await Contact.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(400, 'Failed to update contact');
  return result;
};

const deleteContact = async (id: string) => {
  const result = await Contact.findByIdAndDelete(id);
  if (!result) throw new AppError(400, 'Failed to delete contact');
  return result;
};

export const contactService = {
  createContact,
  getAllContact,
  getSingleContact,
  updateContact,
  deleteContact,
};
