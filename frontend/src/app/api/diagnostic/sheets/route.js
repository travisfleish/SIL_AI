import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    console.log('Sheets diagnostic test started');

    // Check environment variables
    const envCheck = {
      hasSheetId: !!process.env.SHEET_ID,
      hasGoogleEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasGoogleKey: !!process.env.GOOGLE_PRIVATE_KEY?.length,
      sheetId: process.env.SHEET_ID,
      googleEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    };

    console.log('Environment check:', envCheck);

    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.SHEET_ID) {
      return NextResponse.json({
        success: false,
        error: 'Missing required environment variables',
        envCheck
      }, { status: 500 });
    }

    // Format the private key
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    privateKey = privateKey.replace(/\\n/g, '\n');
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }

    // Test Google authentication
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    console.log('Getting auth client...');
    const authClient = await auth.getClient();
    console.log('Auth client created successfully');

    const sheets = google.sheets({
      version: 'v4',
      auth: authClient
    });

    // Test spreadsheet access
    console.log('Testing spreadsheet access...');
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SHEET_ID
    });

    console.log('Spreadsheet accessed successfully');

    // Check if subscribers sheet exists
    let subscribersSheetExists = false;
    let sheetsList = [];

    try {
      const sheetsResponse = response.data.sheets || [];
      sheetsList = sheetsResponse.map(sheet => sheet.properties?.title).filter(Boolean);
      subscribersSheetExists = sheetsList.includes('subscribers');

      console.log('Sheets list:', sheetsList);
      console.log('Subscribers sheet exists:', subscribersSheetExists);
    } catch (sheetsError) {
      console.error('Error checking sheets list:', sheetsError);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      spreadsheet: {
        title: response.data.properties.title,
        sheets: sheetsList,
        subscribersSheetExists
      },
      auth: {
        clientCreated: true,
        serviceAccount: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
      }
    });
  } catch (error) {
    console.error('Sheets diagnostic error:', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code,
      details: error.response?.data?.error || 'No additional details'
    }, { status: 500 });
  }
}