// src/app/api/subscribe-sheets/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Subscribe with Sheets API called');

    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
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

    // Log the submission
    console.log(`Newsletter subscription received for: ${email} at ${new Date().toISOString()}`);

    // Return a clean, simple JSON response
    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing!',
      email: email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Subscribe API error:', error);

    // Return a proper error response
    return NextResponse.json({
      success: false,
      error: 'An error occurred during subscription'
    }, { status: 500 });
  }
}