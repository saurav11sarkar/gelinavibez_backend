import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { messagingRequestController } from './messagingRequest.controller';

const router = express.Router();

// User → send request
router.post(
  '/',
  auth(
    userRole.user,
    userRole.contractor,
    userRole.exterminator,
    userRole.landlord,
    userRole.broker,
  ),
  messagingRequestController.sendRequest,
);

// Admin → view all requests
router.get(
  '/',
  auth(userRole.admin, userRole.superadmin),
  messagingRequestController.getAllRequests,
);

// Admin → approve / reject
router.put(
  '/action',
  auth(userRole.admin, userRole.superadmin),
  messagingRequestController.actionMessagingRequest,
);

export const messagingRequestRoutes = router;
