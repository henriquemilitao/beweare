import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { orderTable } from "@/db/schema";

export const POST = async (request: Request) => {
    console.log('A')
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('B')
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
    console.log('C')
  
  if (!signature) {
    console.log('D')
    return NextResponse.error();
  }
  const text = await request.text();
    console.log('E')
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('F')
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
    console.log('G')
  if (event.type === "checkout.session.completed") {
    console.log('H')
    console.log("Checkout session completed");
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
    console.log('I')
      return NextResponse.error();
    }
    await db
      .update(orderTable)
      .set({
        status: "paid",
      })
      .where(eq(orderTable.id, orderId));
  }
console.log('J')
  return NextResponse.json({ received: true });
};