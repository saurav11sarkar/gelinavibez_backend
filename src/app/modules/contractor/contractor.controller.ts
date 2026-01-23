import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { contractorService } from './contractor.service';

const createContractor = catchAsync(async (req, res) => {
  const userId = req.user?.id;

  const files = req.files as {
    images?: Express.Multer.File[];
    videos?: Express.Multer.File[];
  };

  const images = files?.images || [];
  const videos = files?.videos || [];

  const formData = req.body.data ? JSON.parse(req.body.data) : req.body;

  const result = await contractorService.createContractor(
    userId,
    formData,
    images,
    videos,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor service created successfully',
    data: result,
  });
});

const getAllContractor = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contractorService.getAllContractor(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    data: result,
  });
});

const getSingleContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contractorService.getSingleContractor(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    data: result,
  });
});

const updateContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  const videos = req.files as Express.Multer.File[];
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await contractorService.updateContractor(
    id,
    fromData,
    files,
    videos,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor service updated successfully',
    data: result,
  });
});

const deleteContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contractorService.deleteContractor(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor deleted successfully',
    data: result,
  });
});

const getMyContractorAssignExtermination = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contractorService.getMyContractorAssignExtermination(
    userId,
    options,
  );
  const { meta, ...data } = result;
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    meta: meta,
    data: data,
  });
});

const getAdminContractorAssignExtermination = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contractorService.getAdminContractorAssignExtermination(
    userId,
    options,
  );
  const { meta, ...data } = result;
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    meta: meta,
    data: data,
  });
});

const addAdminContractorAssign = catchAsync(async (req, res) => {
  const adminId = req.user!.id;
  const result = await contractorService.addAdminContractorAssign(
    adminId,
    req.params.id,
    req.params.assigningContractor,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor assigned successfully',
    data: result,
  });
});

const getMyAssignContractor = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const filters = pick(req.query, [
    'searchTerm',
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contractorService.getMyAssignContractor(
    userId,
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMyContractorService = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const filters = pick(req.query, [
    'searchTerm',
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
    'status',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contractorService.getMyContractorService(
    userId,
    filters,
    options,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const allRequestCharge = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
    'status',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contractorService.allRequestCharge(filters, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const chargesContractor = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { charges } = req.body;
  const result = await contractorService.chargesContractor(userId, id, charges);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor updated charges successfully',
    data: result,
  });
});

const updateStatusAdmin = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const { status } = req.body;
  const result = await contractorService.updateStatusAdmin(userId, id, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor status updated successfully',
    data: result,
  });
});

const payContractorCharge = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;

  const result = await contractorService.payContractorCharge(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor charge paid successfully',
    data: result,
  });
});

const createStripeAccount = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await contractorService.createContractorStripeAccount(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: { url: result.url },
  });
});

// Dashboard লিংক নেবে
const getStripeDashboardLink = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await contractorService.getStripeDashboardLink(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: { url: result.url },
  });
});

export const contractorController = {
  createContractor,
  getAllContractor,
  getSingleContractor,
  updateContractor,
  deleteContractor,
  getMyContractorAssignExtermination,
  getAdminContractorAssignExtermination,
  addAdminContractorAssign,
  getMyAssignContractor,
  chargesContractor,
  updateStatusAdmin,
  getMyContractorService,
  payContractorCharge,
  allRequestCharge,

  createStripeAccount,
  getStripeDashboardLink,
};
