import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { callRequestServices } from './callRequest.service';

const createCallRequest = catchAsync(async (req, res) => {
  const result = await callRequestServices.createCallRequest(
    req.user?.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Call request created successfully',
    data: result,
  });
});

const getAllCallRequest = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'firstName',
    'lastName',
    'email',
    'phone',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await callRequestServices.getAllCallRequest(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Call request retrieved successfully',
    data: result,
  });
});
const singleCallRequest = catchAsync(async (req, res) => {
  const result = await callRequestServices.singleCallRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Call request retrieved successfully',
    data: result,
  });
});
const updateCallRequest = catchAsync(async (req, res) => {
  const result = await callRequestServices.updateCallRequest(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Call request updated successfully',
    data: result,
  });
});
const deleteCallRequest = catchAsync(async (req, res) => {
  const result = await callRequestServices.deleteCallRequest(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Call request deleted successfully',
    data: result,
  });
});

export const callRequestController = {
  createCallRequest,
  getAllCallRequest,
  singleCallRequest,
  updateCallRequest,
  deleteCallRequest,
};
