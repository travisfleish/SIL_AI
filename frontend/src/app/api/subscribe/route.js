// src/app/api/subscribe/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Subscribe API called');

    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Received body:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid request body'
      }, { status: 400 });
    }

    const { email } = body;

    if (!email) {
      console.error('Missing email in request');
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    // Log the email for debugging/storage
    console.log(`Newsletter subscription request for: ${email} at ${new Date().toISOString()}`);

    // Simple success response (no actual storage yet)
    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing!',
      email: email
    });
  } catch (error) {
    console.error('Subscribe API error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'An error occurred during subscription'
    }, { status: 500 });
  }
}