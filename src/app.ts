import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFoundError from './app/error/notFoundError';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes/routes';
// import stripeWebhook from './app/modules/payment/payment.webhook';
import webHookHandler from './app/helper/webHookHandler';
// import { chargeController } from './app/modules/charge/charge.controller';
const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      'https://gelinavibez-frontend.vercel.app',
      'https://gelinavibez-admindashboard.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://mybridgepointsolutions.com',
      'https://admin.mybridgepointsolutions.com',
    ],
    credentials: true,
  }),
);
app.use(cookieParser());

// app.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }),
//   chargeController.stripeWebhook,
// );
// app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.post('/webhook', express.raw({ type: 'application/json' }), webHookHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes (Centralized router)
app.use('/api/v1', router);

// Root router
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the server' });
});

// Not found route
app.use(notFoundError);

// Global error handler
app.use(globalErrorHandler);

export default app;
