// charge.controller.ts
import { Request, Response } from 'express';
import { chargeService } from './charge.service';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import pick from '../../helper/pick';

// কন্ট্রাক্টর নতুন চার্জ তৈরি করবে
const createCharge = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await chargeService.createCharge(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Charge created successfully',
    data: result,
  });
});

const updateChargeByAdmin = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { id } = req.params;
  const result = await chargeService.updateChargeByAdmin(userId, id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Charge updated successfully',
    data: result,
  });
});

// ইউজার তার pending চার্জগুলো দেখবে
const getMyCharges = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await chargeService.getUserCharges(userId, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User charges retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// কন্ট্রাক্টর তার তৈরি করা চার্জগুলো দেখবে
const getMyContractorCharges = catchAsync(
  async (req: Request, res: Response) => {
    const contractorId = req.user?.id;
    const result = await chargeService.getContractorCharges(contractorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Contractor charges retrieved successfully',
      data: result,
    });
  },
);

// নির্দিষ্ট চার্জের ডিটেইল্স দেখবে
const getChargeDetail = catchAsync(async (req: Request, res: Response) => {
  const { chargeId } = req.params;
  const result = await chargeService.getChargeById(chargeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Charge details retrieved successfully',
    data: result,
  });
});

const payCharge = catchAsync(async (req: Request, res: Response) => {
  const { chargeId } = req.params;
  const userId = req.user?.id;
  const result = await chargeService.payCharge(userId, chargeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Charge paid successfully',
    data: result,
  });
});

// const stripe = new Stripe(config.stripe.secretKey!);

// const stripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers['stripe-signature'] as string;
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       config.stripe.webhookSecret as string,
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
//   }

//   console.log("type",event)

//   // ✅ Payment success হলে
//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object as Stripe.Checkout.Session;

//     const payment = await Payment.findOne({ stripeSessionId: session.id });
//     console.log('payment', payment);
//     if (payment) {
//       payment.status = 'approved';
//       payment.paymentDate = new Date();
//       await payment.save();

//       const chack = await Charge.findByIdAndUpdate(
//         payment.chargeId,
//         {
//           status: 'paid',
//         },
//         { new: true },
//       );
//       console.log(chack);
//     }
//   }

//   res.json({ received: true });
// };

export const chargeController = {
  createCharge,
  updateChargeByAdmin,
  getMyCharges,
  getMyContractorCharges,
  getChargeDetail,
  payCharge,
  //   stripeWebhook,
};
