// src/app/api/admin/subscribers/route.js
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// Note: In production, you should add authentication to this endpoint
export async function GET() {
  try {
    // Get all subscribers
    const subscribers = await kv.hgetall('subscribers');

    // Format as array with timestamps
    const subscriberList = Object.entries(subscribers || {}).map(([email, timestamp]) => ({
      email,
      subscribed_at: timestamp
    }));

    // Sort by timestamp (newest first)
    subscriberList.sort((a, b) =>
      new Date(b.subscribed_at) - new Date(a.subscribed_at)
    );

    return NextResponse.json({
      success: true,
      count: subscriberList.length,
      subscribers: subscriberList
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}