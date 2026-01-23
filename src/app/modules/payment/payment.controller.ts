import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { paymentService } from './payment.service';

const getAllPayment = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'tenantName',
    'tenantEmail',
    'status',
    'stripeSessionId',
    'stripePaymentIntentId',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await paymentService.getAllPayment(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getMyAllPayment = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'tenantName',
    'tenantEmail',
    'status',
    'stripeSessionId',
    'stripePaymentIntentId',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await paymentService.getMyAllPayment(
    req.user?.id,
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const singlePayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await paymentService.singlePayment(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment fetched successfully',
    data: result,
  });
});

const updatePayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await paymentService.updatePayment(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment updated successfully',
    data: result,
  });
});
const deletePayment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await paymentService.deletePayment(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment deleted successfully',
    data: result,
  });
});

export const paymentController = {
  getAllPayment,
  singlePayment,
  updatePayment,
  deletePayment,
  getMyAllPayment,
};
