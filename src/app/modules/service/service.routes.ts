import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { serviceControllers } from './service.controller';
const router = express.Router();

router.post('/', auth(userRole.admin,userRole.superadmin), serviceControllers.createService);
router.get('/', serviceControllers.getAllService);
router.get('/:id', serviceControllers.singleService);
router.put('/:id', auth(userRole.admin,userRole.superadmin), serviceControllers.updateService);
router.delete('/:id', auth(userRole.admin,userRole.superadmin), serviceControllers.defaultService);

export const serviceRouter = router;
