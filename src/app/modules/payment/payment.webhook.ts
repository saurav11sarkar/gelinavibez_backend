import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Payment } from './payment.model';
import Tenant from '../tenant/tenant.model';
import config from '../../config';
import Charge from '../charge/charge.model';
import User from '../user/user.model';
import sendMailer from '../../helper/sendMailer';

const stripe = new Stripe(config.stripe.secretKey!);

// const stripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers['stripe-signature'] as string;
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       config.stripe.webhookSecret!
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
//   }

//   try {
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object as Stripe.Checkout.Session;
//       const payment = await Payment.findOne({ stripeSessionId: session.id });

//       if (payment) {
//         payment.status = 'approved';
//         payment.paymentDate = new Date();
//         payment.stripePaymentIntentId = session.payment_intent as string;
//         await payment.save();

//         // Charge update
//         await Charge.findByIdAndUpdate(payment.chargeId, { status: 'paid' });

//         // Tenant optional update (admin approval needed)
//         await Tenant.findByIdAndUpdate(payment.tenantId, { status: 'pending' });
//       }
//     }

//     if (event.type === 'payment_intent.payment_failed') {
//       const paymentIntent = event.data.object as Stripe.PaymentIntent;
//       const payment = await Payment.findOne({
//         stripePaymentIntentId: paymentIntent.id,
//       });
//       if (payment) {
//         payment.status = 'denied';
//         await payment.save();
//       }
//     }

//     res.json({ received: true });
//   } catch (error) {
//     res.status(500).send(`Webhook Error: ${(error as Error).message}`);
//   }
// };

// export default stripeWebhook;

// ==================================================================


// import { Request, Response } from 'express';
// import Stripe from 'stripe';
// import { Payment } from './payment.model';
// import Tenant from '../tenant/tenant.model';
// import config from '../../config';
// import Charge from '../charge/charge.model';
// import User from '../user/user.model';
// import sendMailer from '../../helper/sendMailer';

// const stripe = new Stripe(config.stripe.secretKey!);

const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    // ============================
    // ✅ PAYMENT SUCCESS
    // ============================
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const payment = await Payment.findOne({
        stripeSessionId: session.id,
      });

      if (payment) {
        payment.status = 'approved';
        payment.paymentDate = new Date();
        payment.stripePaymentIntentId = session.payment_intent as string;
        await payment.save();

        // Update charge
        const charge: any = await Charge.findByIdAndUpdate(
          payment.chargeId,
          { status: 'paid' },
          { new: true }
        ).populate('contractor')
         .populate('user');

        // Update tenant
        await Tenant.findByIdAndUpdate(payment.tenantId, { status: 'pending' });

        // ============================
        // 📩 EMAIL SEND SECTION
        // ============================
        const user = await User.findById(payment.user);
        const contractor = await User.findById(payment.contractor);

        const htmlBody = `
          <div style="font-family: Arial; padding: 20px; background: #f6f6f6;">
            <div style="max-width: 600px; margin:auto; background:white; padding:20px; border-radius:8px;">
              <h2 style="color:#007bff;">Payment Successful</h2>
              <p><strong>Apartment:</strong> ${payment.apartmentName}</p>
              <p><strong>Service:</strong> ${payment.typeOfProblem}</p>
              <p><strong>Total Amount:</strong> $${payment.amount}</p>
              <p><strong>Admin Share:</strong> $${payment.adminFree}</p>
              <p><strong>Contractor Share:</strong> $${payment.contractorFree}</p>
              <br>
              <p style="color:#666;">— Bridge Point Solution</p>
            </div>
          </div>
        `;

        const recipients = [
          contractor?.email,
          user?.email,
          'saurav.bdcalling@gmail.com', // super admin
        ].filter(Boolean);

        for (const email of recipients) {
          await sendMailer(email!, 'Payment Successful', htmlBody);
        }
      }
    }

    // ============================
    // ❌ PAYMENT FAILED
    // ============================
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });

      if (payment) {
        payment.status = 'denied';
        await payment.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).send(`Webhook Error: ${(error as Error).message}`);
  }
};

export default stripeWebhook;


