import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { exterminationService } from './extermination.service';

const exterminationCreate = catchAsync(async (req, res) => {
  const result = await exterminationService.exterminationCreate(
    req.user?.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination created successfully',
    data: result,
  });
});

const getAllExtermination = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'fullName',
    'email',
    'phoneNumber',
    'propertyAddress',
    'typeOfProperty',
    'preferredContactMethod',
    'typeOfPestProblem',
    'durationOfIssue',
    'previousExterminationService',
    'previousExterminationDate',
    'preferredTime',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await exterminationService.getAllExtermination(
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleExtermination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await exterminationService.getSingleExtermination(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Extermination retrieved successfully',
    data: result,
  });
});
const updateExtermination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await exterminationService.updateExtermination(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination updated successfully',
    data: result,
  });
});
const deleteExtermination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await exterminationService.deleteExtermination(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination deleted successfully',
    data: result,
  });
});

const addContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { contractor } = req.body;

  const result = await exterminationService.addContractor(id, contractor);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor added successfully',
    data: result,
  });
});

const addAdminExterminationAssign = catchAsync(async (req, res) => {
  const adminId = req.user!.id;
  const result = await exterminationService.addAdminExterminationAssign(
    adminId,
    req.params.id,
    req.params.assigningExtermination,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination assigned successfully',
    data: result,
  });
});

const getMyAssignExtermination = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const filters = pick(req.query, [
    'searchTerm',
    'fullName',
    'email',
    'phoneNumber',
    'propertyAddress',
    'typeOfProperty',
    'preferredServiceDate',
    'preferredTime',
    'buildingAccessRequired',
    'contactInfo',
    'signature',
    'status',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await exterminationService.getMyAssignExtermination(
    userId,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My assign extermination retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const chargesExtermination = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { charges } = req.body;
  const result = await exterminationService.chargesExtermination(
    userId,
    id,
    charges,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination updated charges successfully',
    data: result,
  });
});

const updateStatusAdmin = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { status } = req.body;
  const result = await exterminationService.updateStatusAdmin(
    userId,
    id,
    status,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination status updated successfully',
    data: result,
  });
});

const getMyExterminationService = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const filters = pick(req.query, [
    'searchTerm',
    'fullName',
    'email',
    'phoneNumber',
    'propertyAddress',
    'typeOfProperty',
    'preferredServiceDate',
    'preferredTime',
    'buildingAccessRequired',
    'contactInfo',
    'signature',
    'status',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await exterminationService.getMyExterminationService(
    userId,
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My extermination service fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getRequestCharge = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'fullName',
    'email',
    'phoneNumber',
    'propertyAddress',
    'typeOfProperty',
    'preferredServiceDate',
    'preferredTime',
    'buildingAccessRequired',
    'contactInfo',
    'signature',
    'status',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await exterminationService.allRequestCharge(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Request charge fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const payExterminationCharge = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const result = await exterminationService.payExterminationCharge(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination charge paid successfully',
    data: result,
  });
});

export const exterminationController = {
  exterminationCreate,
  getAllExtermination,
  getSingleExtermination,
  updateExtermination,
  deleteExtermination,
  addContractor,
  addAdminExterminationAssign,
  updateStatusAdmin,
  getMyExterminationService,
  payExterminationCharge,
  getRequestCharge,
  getMyAssignExtermination,
  chargesExtermination,
};
