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

    // Get transactions from Stripe
    const stripeCustomer = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true }
    });

    if (!stripeCustomer?.stripeCustomerId) {
      return NextResponse.json([]);
    }

    const charges = await stripe.charges.list({
      customer: stripeCustomer.stripeCustomerId,
      limit: 100,
    });

    const transactions = charges.data.map(charge => ({
      id: charge.id,
      amount: charge.amount,
      status: charge.status,
      description: charge.description,
      createdAt: new Date(charge.created * 1000),
      paymentMethod: {
        brand: charge.payment_method_details?.card?.brand || 'unknown',
        last4: charge.payment_method_details?.card?.last4 || '****'
      }
    }));

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('[TRANSACTIONS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 