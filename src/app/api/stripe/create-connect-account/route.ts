import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { groupId } = body

    if (!groupId) {
      return new NextResponse("Group ID is required", { status: 400 })
    }

    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    await prisma.group.update({
      where: { id: groupId },
      data: { stripeConnectId: account.id }
    })

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/groups/${groupId}/settings`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/groups/${groupId}/settings`,
      type: "account_onboarding",
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.log("[STRIPE_CREATE_CONNECT_ACCOUNT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 