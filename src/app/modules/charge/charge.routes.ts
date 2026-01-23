// charge.routes.ts
import express from 'express';
import { chargeController } from './charge.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';

const router = express.Router();

// কন্ট্রাক্টর চার্জ তৈরি করবে
router.post('/', auth(userRole.contractor), chargeController.createCharge);

// ইউজার তার চার্জগুলো দেখবে
router.get('/my-charges', auth(userRole.user), chargeController.getMyCharges);

// ইউজার পেমেন্ট করবে
router.post('/pay/:chargeId', auth(userRole.user), chargeController.payCharge);

// কন্ট্রাক্টর তার তৈরি করা চার্জগুলো দেখবে
router.get(
  '/my-contractor-charges',
  auth(userRole.contractor),
  chargeController.getMyContractorCharges,
);

// চার্জ ডিটেইল্স দেখবে
router.get(
  '/:chargeId',
  auth(userRole.admin, userRole.user, userRole.contractor, userRole.superadmin),
  chargeController.getChargeDetail,
);

// update charge
router.put(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  chargeController.updateChargeByAdmin,
);

export const chargeRoutes = router;
