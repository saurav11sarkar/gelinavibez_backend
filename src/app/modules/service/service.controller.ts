import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { serviceServices } from './service.service';

const createService = catchAsync(async (req, res) => {
  const result = await serviceServices.createService(req.user?.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});
const getAllService = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'name']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await serviceServices.getAllService(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const singleService = catchAsync(async (req, res) => {
  const result = await serviceServices.singleService(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service retrieved successfully',
    data: result,
  });
});
const updateService = catchAsync(async (req, res) => {
  const result = await serviceServices.updateService(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});
const defaultService = catchAsync(async (req, res) => {
  const result = await serviceServices.defaultService(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

export const serviceControllers = {
  createService,
  getAllService,
  singleService,
  updateService,
  defaultService,
};
