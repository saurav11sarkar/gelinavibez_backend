import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { adminTrackerService } from './admintracker.service';

const getallAdminTracker = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'action',
    'model',
    'description',
  ]);
  const opotions = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

  const result = await adminTrackerService.getallAdminTracker(
    filters,
    opotions,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin Tracker List',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdminTracker = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminTrackerService.getSingleAdminTracker(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin Tracker List',
    data: result,
  });
});

const deleteAdminTracker = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await adminTrackerService.deleteAdminTracker(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin Tracker List',
    data: result,
  });
});

export const adminTrackerController = {
  getallAdminTracker,
  getSingleAdminTracker,
  deleteAdminTracker,
};
