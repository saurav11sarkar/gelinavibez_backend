import express from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../helper/fileUploder';
import { userRole } from './user.constant';

const router = express.Router();

router.post(
  '/create-user',
  auth(userRole.superadmin, userRole.admin),
  userController.createUser,
);

router.get(
  '/profile',
  auth(
    userRole.admin,
    userRole.contractor,
    userRole.user,
    userRole.superadmin,
    userRole.exterminator,
    userRole.landlord,
    userRole.broker,
  ),
  userController.profile,
);
router.put(
  '/profile',
  auth(
    userRole.admin,
    userRole.contractor,
    userRole.user,
    userRole.superadmin,
    userRole.exterminator,
    userRole.landlord,
    userRole.broker,
  ),
  fileUploader.upload.single('profileImage'),
  userController.updateProfile,
);

// request admin
router.post('/request-admin', auth(userRole.user), userController.requestAdmin);
router.put(
  '/update-admin/:id',
  auth(userRole.superadmin),
  userController.updateAdmin,
);
router.delete(
  '/delete-admin/:id',
  auth(userRole.superadmin),
  userController.deleteAdmin,
);
router.get(
  '/all-request-admin',
  auth(userRole.superadmin),
  userController.allRequestAdmin,
);

router.get(
  '/all-user',
  auth(
    userRole.admin,
    userRole.superadmin,
    userRole.landlord,
    userRole.broker,
    userRole.contractor,
    userRole.exterminator,
    userRole.user,
  ),
  userController.getAllUser,
);

//=== verified user ===
router.put(
  '/approved-user/:id',
  auth(userRole.admin, userRole.superadmin),
  userController.approvedLandlordBrokerAdmin,
);
router.put(
  '/rejected-user/:id',
  auth(userRole.admin, userRole.superadmin),
  userController.rejectedLandlordBrokerAdmin,
);

// router.post(
//   '/grant',
//   auth(userRole.admin, userRole.superadmin),
//   userController.grantMessagingPermission,
// );

//=== verified user ===
router.get(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  userController.getUserById,
);

router.delete(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  userController.deleteUserById,
);

router.put(
  '/update-access-routes/:id',
  auth(userRole.superadmin),
  userController.updateAccessRoutes,
);

router.put(
  '/:id',
  auth(userRole.superadmin, userRole.admin),
  fileUploader.upload.single('profileImage'),
  userController.updateUserById,
);

export const userRoutes = router;
