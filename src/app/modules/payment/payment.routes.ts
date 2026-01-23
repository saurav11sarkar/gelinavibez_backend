import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { paymentController } from './payment.controller';
const router = express.Router();

router.get('/', auth(userRole.admin,userRole.superadmin), paymentController.getAllPayment);
router.get(
  '/my',
  auth(userRole.contractor, userRole.admin, userRole.user,userRole.superadmin),
  paymentController.getMyAllPayment,
);
router.get('/:id', auth(userRole.admin,userRole.superadmin), paymentController.singlePayment);
router.put('/:id', auth(userRole.admin,userRole.superadmin), paymentController.updatePayment);
router.delete('/:id', auth(userRole.admin,userRole.superadmin), paymentController.deletePayment);

export const paymentRouter = router;
