import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseClient } from '@/lib/supabase'

// Lazy initialization to avoid build-time errors
function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-12-18.acacia',
  })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const stripe = getStripeClient()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getSupabaseClient()

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      // Grant course access
      const userId = session.metadata?.userId
      const courseId = session.metadata?.courseId || '0-100-rating-course'

      if (!userId) {
        console.error('No userId in session metadata')
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
      }

      // Insert course access record
      const { error: insertError } = await supabase.from('course_access').insert({
        user_id: userId,
        course_id: courseId,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_customer_id: session.customer as string,
        status: 'active',
        purchased_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error('Error granting course access:', insertError)
        // Check if it's a duplicate (user already has access)
        if (insertError.code === '23505') {
          // Unique constraint violation - user already has access
          return NextResponse.json({ received: true })
        }
        return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 })
      }

      console.log(`Course access granted to user ${userId} for course ${courseId}`)
      break
    }

    case 'payment_intent.succeeded': {
      // Payment was successful, but we handle access in checkout.session.completed
      console.log('Payment intent succeeded')
      break
    }

    case 'payment_intent.payment_failed': {
      console.log('Payment intent failed')
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
