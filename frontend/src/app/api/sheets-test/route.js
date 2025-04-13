// src/app/api/sheets-test/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    console.log('Testing simpler Google Sheets API approach');

    // Check environment variables
    const envCheck = {
      hasSheetId: !!process.env.SHEET_ID,
      hasGoogleEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasGoogleKey: Boolean(process.env.GOOGLE_PRIVATE_KEY?.length)
    };

    console.log('Environment check:', envCheck);

    // Format private key
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ?.replace(/\\n/g, '\n')
      .replace(/^"(.*)"$/, '$1');

    // Create a token
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign({
      iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    }, privateKey, { algorithm: 'RS256' });

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get access token',
        details: tokenData
      }, { status: 500 });
    }

    // Test access to the spreadsheet
    const sheetsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}?fields=properties.title`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    );

    const sheetsData = await sheetsResponse.json();

    return NextResponse.json({
      success: true,
      spreadsheetTitle: sheetsData.properties?.title,
      message: 'Successfully connected to Google Sheets API'
    });
  } catch (error) {
    console.error('Error in simple sheets test:', error);

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}