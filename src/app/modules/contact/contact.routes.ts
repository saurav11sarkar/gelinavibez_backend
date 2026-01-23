import express from 'express';
import { contactController } from './contact.controller';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

router.post('/', contactController.createContact);
router.get('/', auth(userRole.admin,userRole.superadmin), contactController.getAllContact);
router.get('/:id', auth(userRole.admin,userRole.superadmin), contactController.getSingleContact);
router.put('/:id', auth(userRole.admin,userRole.superadmin), contactController.updateContact);
router.delete('/:id', auth(userRole.admin,userRole.superadmin), contactController.deleteContact);

export const contactRouter = router;
