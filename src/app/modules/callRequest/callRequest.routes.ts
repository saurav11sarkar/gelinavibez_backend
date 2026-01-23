import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { callRequestController } from './callRequest.controller';
const router = express.Router();

router.post('/', auth(userRole.user), callRequestController.createCallRequest);
router.get('/', auth(userRole.admin,userRole.superadmin), callRequestController.getAllCallRequest);
router.get(
  '/:id',
  auth(userRole.admin,userRole.superadmin),
  callRequestController.singleCallRequest,
);
router.put(
  '/:id',
  auth(userRole.admin,userRole.superadmin),
  callRequestController.updateCallRequest,
);
router.delete(
  '/:id',
  auth(userRole.admin,userRole.superadmin),
  callRequestController.deleteCallRequest,
);

export const callRequestRouter = router;
