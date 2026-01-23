import express from 'express';
import { messageController } from './message.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { fileUploader } from '../../helper/fileUploder';

const router = express.Router();

// router.post(
//   '/',
//   auth(userRole.contractor, userRole.user, userRole.admin, userRole.superadmin),
//   fileUploader.upload.single('file'),
//   messageController.createMessage,
// );

router.post(
  '/',
  auth(
    userRole.user,
    userRole.contractor,
    userRole.exterminator,
    userRole.admin,
    userRole.superadmin,
    userRole.broker,
    userRole.landlord,
  ),
  fileUploader.upload.single('file'),
  messageController.createMessage,
);

// router.get(
//   '/:conversationId',
//   auth(userRole.contractor, userRole.user,userRole.admin, userRole.superadmin),
//   messageController.getMessages,
// );

router.get(
  '/:conversationId',
  auth(
    userRole.user,
    userRole.contractor,
    userRole.exterminator,
    userRole.admin,
    userRole.superadmin,
    userRole.broker,
    userRole.landlord,
  ),
  messageController.getMessages,
);

// router.put(
//   '/:id',
//   auth(userRole.contractor, userRole.user, userRole.admin, userRole.superadmin),
//   messageController.updateMessage,
// );

router.put(
  '/:id',
  auth(
    userRole.user,
    userRole.contractor,
    userRole.exterminator,
    userRole.admin,
    userRole.superadmin,
    userRole.broker,
  ),
  messageController.updateMessage,
);

// router.delete(
//   '/:id',
//   auth(userRole.contractor, userRole.user, userRole.admin, userRole.superadmin),
//   messageController.deleteMessage,
// );

router.delete(
  '/:id',
  auth(
    userRole.user,
    userRole.contractor,
    userRole.exterminator,
    userRole.admin,
    userRole.superadmin,
  ),
  messageController.deleteMessage,
);

export const messageRoutes = router;
