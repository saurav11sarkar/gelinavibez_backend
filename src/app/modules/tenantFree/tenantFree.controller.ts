import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { tenantFreeService } from './tenantFree.service';

const getApplicationFee = catchAsync(async (req, res) => {
  const result = await tenantFreeService.getApplicationFee();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Application fee retrieved successfully',
    data: result,
  });
});

const updateApplicationFee = catchAsync(async (req, res) => {
  const result = await tenantFreeService.updateApplicationFee(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Application fee updated successfully',
    data: result,
  });
});

export const tenantFreeController = {
  getApplicationFee,
  updateApplicationFee,
};
