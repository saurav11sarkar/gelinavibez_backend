import { cleanRegex } from 'zod/v4/core/util.cjs';
import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { SubscribePlanService } from './subscribeplan.service';

const createSubscribePlan = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  console.log(userId);
  const result = await SubscribePlanService.createSubscribePlan(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'SubscribePlan created successfully',
    data: result,
  });
});

const getAllSubscribePlan = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'name',
    'type',
    'features',
    'status',
  ]);
  const options = pick(req.query, ['sortBy', 'sortOrder', 'limit', 'page']);
  const result = await SubscribePlanService.getAllSubscribePlan(
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SubscribePlan fetched successfully',
    data: result,
  });
});

const getSingleSubscribePlan = catchAsync(async (req, res) => {
  const result = await SubscribePlanService.getSingleSubscribePlan(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SubscribePlan fetched successfully',
    data: result,
  });
});

const updateSubscribePlan = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await SubscribePlanService.updateSubscribePlan(
    userId,
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SubscribePlan updated successfully',
    data: result,
  });
});

const deleteSubscribePlan = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await SubscribePlanService.deleteSubscribePlan(
    userId,
    req.params.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SubscribePlan deleted successfully',
    data: result,
  });
});

const paySubscribePlan = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await SubscribePlanService.paySubscribePlan(
    userId,
    req.params.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'SubscribePlan paid successfully',
    data: result,
  });
});

export const subscribePlanController = {
  createSubscribePlan,
  getAllSubscribePlan,
  getSingleSubscribePlan,
  updateSubscribePlan,
  deleteSubscribePlan,
  paySubscribePlan,
};
