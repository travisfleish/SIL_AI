// src/app/api/cron/sync-sheets/route.js
import { NextResponse } from 'next/server';
import { syncSubscribersToGoogleSheet } from '@/lib/syncSubscribers';

export const config = {
  runtime: 'edge',
  // If using NextJS 13 App Router, use this instead:
  // export const runtime = 'edge';
};

export async function GET(request) {
  // Verify that this is a cron job request (optional security)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const result = await syncSubscribersToGoogleSheet();

    return NextResponse.json({
      success: true,
      message: result.message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}