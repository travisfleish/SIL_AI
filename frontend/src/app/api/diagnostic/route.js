import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Collect environment information (excluding sensitive data)
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasSheetId: !!process.env.SHEET_ID,
      hasGoogleEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasGoogleKey: !!process.env.GOOGLE_PRIVATE_KEY?.length,
      timestamp: new Date().toISOString(),
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    };

    console.log('Diagnostic API called:', envInfo);

    return NextResponse.json({
      success: true,
      message: 'API endpoint is working',
      environment: envInfo
    });
  } catch (error) {
    console.error('Diagnostic API error:', error);

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}