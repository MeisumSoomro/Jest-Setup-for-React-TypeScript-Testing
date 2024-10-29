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

    const subscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE'
      },
      include: {
        tier: true
      }
    });

    if (!subscription) {
      return NextResponse.json(null);
    }

    // Get Stripe subscription details
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    return NextResponse.json({
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      plan: {
        name: subscription.tier.name,
        price: subscription.tier.price,
        interval: stripeSubscription.items.data[0].plan.interval
      }
    });
  } catch (error) {
    console.error('[SUBSCRIPTION_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 