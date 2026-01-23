import express from 'express';
import { subscribeController } from './subscribe.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.post(
  '/broadcast',
  auth(userRole.admin,userRole.superadmin),
  subscribeController.broadcastNewsletter,
);
router.post('/', subscribeController.createSubscrube);
router.get('/', subscribeController.getAllSubscribe);
router.get('/:id', subscribeController.getSingleSubscribe);
router.put('/:id', subscribeController.updateSubscribe);
router.delete('/:id', subscribeController.deleteSubscribe);

export const subscribeRouter = router;
