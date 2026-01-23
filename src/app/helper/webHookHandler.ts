import Stripe from 'stripe';
import config from '../config';
import { Request, Response } from 'express';
import { Payment } from '../modules/payment/payment.model';
import User from '../modules/user/user.model';
import SubscribePlan from '../modules/subscribeplan/subscribeplan.model';
import Contractor from '../modules/contractor/contractor.model';
import Extermination from '../modules/extermination/extermination.model';
// import Tenant from '../modules/tenant/tenant.model';

const stripe = new Stripe(config.stripe.secretKey!);

const webHookHandler = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret!,
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send('Webhook Error');
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const payment = await Payment.findOne({
        stripeSessionId: session.id,
      });
      if (!payment) {
        return res.status(404).send('Payment not found');
      }

      const user = await User.findById(payment.user);
      if (!user) {
        return res.status(404).send('User not found');
      }

      payment.status = 'approved';
      payment.stripePaymentIntentId = session.payment_intent as string;
      payment.paymentDate = new Date();
      await payment.save();

      const paymentType = session?.metadata?.paymentType;
      if (paymentType === 'subscribePlan') {
        const subscription = await SubscribePlan.findById(
          payment.subscribePlanId,
        );
        if (!subscription) return res.json({ received: true });

        if (!subscription.subscriptionUser?.includes(user._id)) {
          subscription?.subscriptionUser?.push(user._id);
          await subscription.save();
        }

        const monthAdd = subscription.type === 'yearly' ? 12 : 1;

        const expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + monthAdd);

        user.isSubscription = true;
        user.subscription = subscription._id;
        user.subscriptionExpiry = expireDate;
        await user.save();

        return res.json({ received: true });
      }
      if (paymentType === 'contractorCharge') {
        const contractor = await Contractor.findById(payment.contractor);
        if (!contractor) return res.json({ received: true });

        contractor.status = 'completed';
        await contractor.save();

        return res.json({ received: true });
      }

      if (paymentType === 'exterminationCharge') {
        const extermination = await Extermination.findById(
          payment.extermination,
        );
        if (!extermination) return res.json({ received: true });

        extermination.status = 'completed';
        await extermination.save();

        return res.json({ received: true });
      }

      // if (paymentType === 'applicationFee') {
      //   const tenant = await Tenant.findById(payment.tenantId);
      //   if (!tenant) return res.json({ received: true });

      //   tenant.status = 'approved';
      //   await tenant.save();

      //   return res.json({ received: true });
      // }

      return res.status(200).send('Payment completed');
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send('Webhook Error');
  }
};

export default webHookHandler;
