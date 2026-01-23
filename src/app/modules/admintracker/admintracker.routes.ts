import express from 'express';
import { adminTrackerController } from './admintracker.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.get(
  '/',
  auth(userRole.superadmin),
  adminTrackerController.getallAdminTracker,
);
router.get(
  '/:id',
  auth(userRole.superadmin),
  adminTrackerController.getSingleAdminTracker,
);
router.delete(
  '/:id',
  auth(userRole.superadmin),
  adminTrackerController.deleteAdminTracker,
);

export const adminTrackerRoutes = router;
