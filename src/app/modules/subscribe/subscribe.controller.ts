import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { subscribeService } from './subscribe.service';

const createSubscrube = catchAsync(async (req, res) => {
  const result = await subscribeService.createSubscrube(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscribe created successfully',
    data: result,
  });
});

const getAllSubscribe = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'firstName',
    'lastName',
    'email',
    'phone',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await subscribeService.getAllSubscribe(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscribe fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSubscribe = catchAsync(async (req, res) => {
  const result = await subscribeService.getSingleSubscribe(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscribe fetched successfully',
    data: result,
  });
});

const updateSubscribe = catchAsync(async (req, res) => {
  const result = await subscribeService.updateSubscribe(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscribe updated successfully',
    data: result,
  });
});
const deleteSubscribe = catchAsync(async (req, res) => {
  const result = await subscribeService.deleteSubscribe(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscribe deleted successfully',
    data: result,
  });
});

const broadcastNewsletter = catchAsync(async (req, res) => {
  const result = await subscribeService.broadcastNewsletter(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Newsletter broadcasted successfully',
    data: result,
  });
});

export const subscribeController = {
  createSubscrube,
  getAllSubscribe,
  getSingleSubscribe,
  updateSubscribe,
  deleteSubscribe,
  broadcastNewsletter,
};
