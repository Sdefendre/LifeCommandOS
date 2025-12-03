import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseClient, checkCourseAccess } from '@/lib/supabase'

// Lazy initialization to avoid build-time errors
function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-02-24.acacia',
  })
}

const COURSE_PRICE_ID = process.env.STRIPE_COURSE_PRICE_ID || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, courseId = '0-100-rating-course' } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (!COURSE_PRICE_ID) {
      return NextResponse.json({ error: 'Stripe price ID not configured' }, { status: 500 })
    }

    // Check if user already has access
    const hasAccess = await checkCourseAccess(userId, courseId)
    if (hasAccess) {
      return NextResponse.json({ error: 'User already has access to this course' }, { status: 400 })
    }

    // Get user email from Supabase
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userEmail = userData.user.email

    // Create Stripe checkout session
    const stripe = getStripeClient()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: COURSE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/course/content?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/course?canceled=true`,
      customer_email: userEmail || undefined,
      metadata: {
        userId,
        courseId,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
