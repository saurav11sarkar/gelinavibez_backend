import express from 'express';
import { tenantFreeController } from './tenantFree.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.get('/', tenantFreeController.getApplicationFee);
router.put(
  '/',
  auth(userRole.admin,userRole.superadmin),
  tenantFreeController.updateApplicationFee,
);

export const tenantFreeRoutes = router;
