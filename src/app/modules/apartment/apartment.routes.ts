import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { apartmentController } from './apartment.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.get('/group-by-day', apartmentController.getAllApartmentGroupByDay);
router.get('/locations', apartmentController.getAllApartmentLocations);

//=== assasint landlord ===
router.get(
  '/assasint-landlord',
  auth(userRole.landlord),
  apartmentController.showAssasintLandlordApartment,
);
router.get(
  '/assasint-broker',
  auth(userRole.broker),
  apartmentController.showAssasintBrokerApartment,
);
//=== assasint landlord ===

// my apartment-------------------

router.get(
  '/my-apartments',
  auth(userRole.admin, userRole.user, userRole.contractor, userRole.superadmin),
  apartmentController.getMyApartments,
);
router.get(
  '/my-apartments/:id',
  auth(userRole.admin, userRole.user, userRole.contractor, userRole.superadmin),
  apartmentController.getMySingleApartment,
);
router.put(
  '/my-apartments/:id',
  auth(userRole.admin, userRole.user, userRole.contractor, userRole.superadmin),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  apartmentController.updateMyApartment,
);
router.delete(
  '/my-apartments/:id',
  auth(userRole.admin, userRole.user, userRole.contractor, userRole.superadmin),
  apartmentController.deleteMyApartment,
);

// ---------------------------------

router.post(
  '/',
  auth(userRole.admin, userRole.user, userRole.contractor, userRole.superadmin),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  apartmentController.createApartment,
);
router.get('/', apartmentController.getAllApartment);

router.put(
  '/:id/status',
  auth(userRole.admin, userRole.superadmin),
  apartmentController.updateApartmentStatus,
);

router.get('/:id', apartmentController.singleApartment);
router.put(
  '/:id',
  auth(userRole.admin, userRole.user, userRole.contractor, userRole.superadmin),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  apartmentController.updateApartment,
);
router.delete(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  apartmentController.deleteApartment,
);

//=== assasint landlord ===
router.put(
  '/:id/assasint-landlord/:landlordId',
  auth(userRole.admin, userRole.superadmin),
  apartmentController.assasintLandlord,
);
router.delete(
  '/:id/assasint-landlord/:landlordId',
  auth(userRole.admin, userRole.superadmin),
  apartmentController.removeLandlord,
);
router.put(
  '/:id/assasint-broker/:brokerId',
  auth(userRole.admin, userRole.superadmin),
  apartmentController.assasintBroker,
);
router.delete(
  '/:id/assasint-broker/:brokerId',
  auth(userRole.admin, userRole.superadmin),
  apartmentController.removeBroker,
);

router.post(
  '/:id/note',
  auth(userRole.admin, userRole.broker, userRole.superadmin),
  apartmentController.createNote,
);

// === assasint landlord ===

export const apartmentRouter = router;
