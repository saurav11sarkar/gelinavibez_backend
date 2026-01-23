import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { dashboardService } from './dashboard.service';

const dashboardViewCount = catchAsync(async (req, res) => {
  console.log('first');
  const result = await dashboardService.dashboardViewCount();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard view count retrieved successfully',
    data: result,
  });
});

const getMonthlyEarnings = catchAsync(async (req, res) => {
  const { year } = req.query;
  const selectedYear = year ? Number(year) : new Date().getFullYear();
  const result = await dashboardService.getMonthlyEarnings(selectedYear);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Monthly earnings retrieved successfully',
    data: result,
  });
});

export const dashboardControllers = {
  dashboardViewCount,
  getMonthlyEarnings,
};
