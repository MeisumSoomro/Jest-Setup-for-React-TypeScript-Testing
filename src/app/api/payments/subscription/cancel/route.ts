import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      }
    });

    if (!subscription) {
      return new NextResponse('No active subscription found', { status: 404 });
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Update the subscription status in the database
    const updatedSubscription = await db.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED' },
      include: { tier: true }
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('[SUBSCRIPTION_CANCEL]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 