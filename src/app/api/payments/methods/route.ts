import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const stripeCustomer = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true }
    });

    if (!stripeCustomer?.stripeCustomerId) {
      return NextResponse.json([]);
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomer.stripeCustomerId,
      type: 'card'
    });

    return NextResponse.json(paymentMethods.data.map(method => ({
      id: method.id,
      brand: method.card?.brand,
      last4: method.card?.last4,
      expiryMonth: method.card?.exp_month,
      expiryYear: method.card?.exp_year,
      isDefault: method.id === stripeCustomer.defaultPaymentMethodId
    })));
  } catch (error) {
    console.error('[PAYMENT_METHODS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const { paymentMethodId } = json;

    const user = await db.user.update({
      where: { id: session.user.id },
      data: { defaultPaymentMethodId: paymentMethodId }
    });

    // Update default payment method in Stripe
    await stripe.customers.update(user.stripeCustomerId!, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PAYMENT_METHODS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 