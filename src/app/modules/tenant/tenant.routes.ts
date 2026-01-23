import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { tenantController } from './tenant.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.get(
  '/my',
  auth(userRole.user),
  tenantController.getMyAllTenantApplication,
);
//=== landlord ===
router.get(
  '/my-landlords',
  auth(userRole.landlord),
  tenantController.getMyAllTenantApplicationlandlords,
);
//=== landlord ===

router.post(
  '/',
  auth(userRole.user),
  fileUploader.upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'ssnDoc', maxCount: 1 },
    { name: 'voucherDoc', maxCount: 1 },
    { name: 'incomeDoc', maxCount: 1 },
  ]),
  tenantController.createTenant,
);

router.get(
  '/',
  auth(userRole.admin, userRole.superadmin),
  tenantController.getAllTenantApplication,
);

router.get(
  '/:id',
  auth(userRole.admin, userRole.user, userRole.superadmin),
  tenantController.getTenantApplication,
);

router.put(
  '/:id',
  auth(userRole.user, userRole.admin, userRole.superadmin),
  fileUploader.upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'ssnDoc', maxCount: 1 },
    { name: 'voucherDoc', maxCount: 1 },
    { name: 'incomeDoc', maxCount: 1 },
  ]),
  tenantController.updateTenantApplication,
);

router.delete(
  '/:id',
  auth(userRole.user, userRole.admin, userRole.superadmin),
  tenantController.deleteTenantApplication,
);

router.patch(
  '/:id/approve',
  auth(userRole.admin, userRole.superadmin, userRole.landlord),
  tenantController.approveTenant,
);
router.patch(
  '/:id/deny',
  auth(userRole.admin, userRole.superadmin, userRole.landlord),
  tenantController.denyTenant,
);

export const tenantRouter = router;
