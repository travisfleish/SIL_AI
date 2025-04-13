import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Subscribe KV endpoint called');

    // Parse request body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      console.error('Missing email in request');
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    // Check if email already exists
    const existingEmail = await kv.hget('subscribers', email);
    if (existingEmail) {
      console.log(`Email already subscribed: ${email}`);
      return NextResponse.json({
        success: false,
        message: 'Email already subscribed'
      });
    }

    // Store email with timestamp
    const timestamp = new Date().toISOString();
    await kv.hset('subscribers', {
      [email]: timestamp
    });

    console.log(`Stored subscription for: ${email} at ${timestamp}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing!',
      email
    });
  } catch (error) {
    console.error('Subscribe KV API error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'An error occurred during subscription'
    }, { status: 500 });
  }
}