import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { tenantService } from './tenant.service';

const createTenant = catchAsync(async (req, res) => {
  const formData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await tenantService.createTenant(
    req.user?.id,
    formData,
    req.files as any,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant created',
    data: result,
  });
});

const approveTenant = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await tenantService.approveTenant(userId, req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant approved',
    data: result,
  });
});

const denyTenant = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await tenantService.denyTenant(userId, req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant denied',
    data: result,
  });
});

const getAllTenantApplication = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'firstName',
    'lastName',
    'email',
    'phone',
    'ssn',
    'status',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await tenantService.getAllTenantApplication(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant applications',
    meta: result.meta,
    data: result.data,
  });
});

const getMyAllTenantApplication = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'firstName',
    'lastName',
    'email',
    'phone',
    'ssn',
    'status',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await tenantService.getMyAllTenantApplication(
    req.user?.id,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant applications',
    meta: result.meta,
    data: result.data,
  });
});
const getMyAllTenantApplicationlandlords = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'firstName',
    'lastName',
    'email',
    'phone',
    'ssn',
    'status',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await tenantService.getMyAllTenantApplicationlandlords(
    req.user?.id,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant applications',
    meta: result.meta,
    data: result.data,
  });
});

const getTenantApplication = catchAsync(async (req, res) => {
  const result = await tenantService.getTenantApplication(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant application',
    data: result,
  });
});
const updateTenantApplication = catchAsync(async (req, res) => {
  const result = await tenantService.updateTenantApplication(
    req.params.id,
    req.body,
    req.files as any,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant application updated',
    data: result,
  });
});
const deleteTenantApplication = catchAsync(async (req, res) => {
  const result = await tenantService.deleteTenantApplication(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant application deleted',
    data: result,
  });
});

export const tenantController = {
  createTenant,
  approveTenant,
  denyTenant,
  getAllTenantApplication,
  getTenantApplication,
  updateTenantApplication,
  deleteTenantApplication,
  getMyAllTenantApplication,
  getMyAllTenantApplicationlandlords,
};
