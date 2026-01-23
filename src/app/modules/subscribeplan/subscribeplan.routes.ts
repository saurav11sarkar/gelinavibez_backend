import express from 'express';
import { subscribePlanController } from './subscribeplan.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin, userRole.superadmin),
  subscribePlanController.createSubscribePlan,
);
router.get('/', subscribePlanController.getAllSubscribePlan);
router.get('/:id', subscribePlanController.getSingleSubscribePlan);
router.put(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  subscribePlanController.updateSubscribePlan,
);
router.delete(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  subscribePlanController.deleteSubscribePlan,
);
router.post(
  '/pay/:id',
  auth(userRole.landlord),
  subscribePlanController.paySubscribePlan,
);

export const subscribePlanRoutes = router;
