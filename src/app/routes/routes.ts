import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { apartmentRouter } from '../modules/apartment/apartment.routes';
import { contactRouter } from '../modules/contact/contact.routes';
import { serviceRouter } from '../modules/service/service.routes';
import { contractorRouter } from '../modules/contractor/contractor.routes';
import { callRequestRouter } from '../modules/callRequest/callRequest.routes';
import { tenantRouter } from '../modules/tenant/tenant.routes';
import { paymentRouter } from '../modules/payment/payment.routes';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes';
import { subscribeRouter } from '../modules/subscribe/subscribe.routes';
import { exterminationRouter } from '../modules/extermination/extermination.routes';
import { chargeRoutes } from '../modules/charge/charge.routes';
import { tenantFreeRoutes } from '../modules/tenantFree/tenantFree.routes';
import { conversationRoutes } from '../modules/conversation/conversation.routes';
import { messageRoutes } from '../modules/message/message.routes';
import { subscribePlanRoutes } from '../modules/subscribeplan/subscribeplan.routes';
import { adminTrackerRoutes } from '../modules/admintracker/admintracker.routes';
import { messagingRequestRoutes } from '../modules/messagingRequest/messagingRequest.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/apartment',
    route: apartmentRouter,
  },
  {
    path: '/contact',
    route: contactRouter,
  },
  {
    path: '/service',
    route: serviceRouter,
  },
  {
    path: '/contractor',
    route: contractorRouter,
  },
  {
    path: '/callrequest',
    route: callRequestRouter,
  },
  {
    path: '/tenant',
    route: tenantRouter,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
  {
    path: '/dashboard',
    route: dashboardRouter,
  },
  {
    path: '/subscribe',
    route: subscribeRouter,
  },
  {
    path: '/extermination',
    route: exterminationRouter,
  },
  {
    path: '/charge',
    route: chargeRoutes,
  },
  {
    path: '/tenantfree',
    route: tenantFreeRoutes,
  },
  {
    path: '/conversation',
    route: conversationRoutes,
  },
  {
    path: '/message',
    route: messageRoutes,
  },
  {
    path: '/subscribeplan',
    route: subscribePlanRoutes,
  },
  {
    path: '/admin-tracker',
    route: adminTrackerRoutes,
  },
  {
    path: '/messaging-request',
    route: messagingRequestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
