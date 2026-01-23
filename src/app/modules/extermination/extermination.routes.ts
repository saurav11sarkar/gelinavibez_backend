import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { exterminationController } from './extermination.controller';
const router = express.Router();

//=== update router ===
router.get(
  '/my-assign-extermination',
  auth(userRole.exterminator),
  exterminationController.getMyAssignExtermination,
);
router.put(
  '/charges/:id',
  auth(userRole.exterminator, userRole.admin, userRole.superadmin),
  exterminationController.chargesExtermination,
);
router.put(
  '/status/:id',
  auth(userRole.admin, userRole.superadmin),
  exterminationController.updateStatusAdmin,
);
router.get(
  '/my-extermination-service',
  auth(userRole.user),
  exterminationController.getMyExterminationService,
);

router.get(
  '/request-charge',
  auth(userRole.admin, userRole.superadmin),
  exterminationController.getRequestCharge,
);
//=== update router ===

router.put(
  '/add-contractor/:id',
  auth(userRole.admin, userRole.superadmin),
  exterminationController.addContractor,
);

router.post(
  '/',
  auth(userRole.user),
  exterminationController.exterminationCreate,
);
router.get(
  '/',
  auth(userRole.admin, userRole.superadmin),
  exterminationController.getAllExtermination,
);
router.get(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  exterminationController.getSingleExtermination,
);
router.put(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  exterminationController.updateExtermination,
);
router.delete(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  exterminationController.deleteExtermination,
);

//=== Admin Routes ===
router.put(
  '/:id/assign-extermination/:assigningExtermination',
  auth(userRole.admin, userRole.superadmin),
  exterminationController.addAdminExterminationAssign,
);

router.post(
  '/:id/pay-extermination-charge',
  auth(userRole.user),
  exterminationController.payExterminationCharge,
);

//=== Admin Routes ===

export const exterminationRouter = router;
