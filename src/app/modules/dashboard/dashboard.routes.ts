import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { dashboardControllers } from './dashboard.controller';

const router = express.Router();

router.get('/', auth(userRole.admin,userRole.superadmin), dashboardControllers.dashboardViewCount);

router.get(
  '/monthly-earnings',
  auth(userRole.admin,userRole.superadmin),
  dashboardControllers.getMonthlyEarnings,
);

export const dashboardRouter = router;
