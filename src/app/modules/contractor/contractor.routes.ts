import express from 'express';
import { contractorController } from './contractor.controller';
import { fileUploader } from '../../helper/fileUploder';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

// কন্ট্রাক্টর Stripe account তৈরি করবে
router.post(
  '/create-stripe-account',
  auth(userRole.contractor),
  contractorController.createStripeAccount,
);

// কন্ট্রাক্টর Stripe dashboard লিংক নেবে
router.get(
  '/dashboard-link',
  auth(userRole.contractor),
  contractorController.getStripeDashboardLink,
);

// ==update ===
router.get(
  '/my-assign-contractor',
  auth(userRole.contractor),
  contractorController.getMyAssignContractor,
);

router.put(
  '/charges/:id',
  auth(userRole.contractor, userRole.admin, userRole.superadmin),
  contractorController.chargesContractor,
);

router.put(
  '/status/:id',
  auth(userRole.admin, userRole.superadmin),
  contractorController.updateStatusAdmin,
);

router.get(
  '/my-contractor-service',
  auth(userRole.user),
  contractorController.getMyContractorService,
);

router.get(
  '/request-charge',
  auth(userRole.admin, userRole.superadmin),
  contractorController.allRequestCharge,
);

// === X ===

router.get(
  '/my-assign-extermination',
  auth(userRole.contractor),
  contractorController.getMyContractorAssignExtermination,
);
router.get(
  '/admin-assign-extermination',
  auth(userRole.admin, userRole.superadmin),
  contractorController.getAdminContractorAssignExtermination,
);

router.post(
  '/',
  auth(userRole.user),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  contractorController.createContractor,
);

router.get('/', contractorController.getAllContractor);
router.get('/:id', contractorController.getSingleContractor);
router.put('/:id', contractorController.updateContractor);
router.delete('/:id', contractorController.deleteContractor);

// === X ===
router.put(
  '/:id/assign-contractor/:assigningContractor',
  auth(userRole.admin, userRole.superadmin),
  contractorController.addAdminContractorAssign,
);

router.post(
  '/:id/pay-contractor-charge',
  auth(userRole.user),
  contractorController.payContractorCharge,
);
// === X ===

export const contractorRouter = router;
