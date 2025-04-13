// src/app/api/sheets-test/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing Google Sheets API with direct fetch approach');

    // Check environment variables
    const envCheck = {
      hasSheetId: !!process.env.SHEET_ID,
      hasGoogleEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasGoogleKey: Boolean(process.env.GOOGLE_PRIVATE_KEY?.length),
      sheetId: process.env.SHEET_ID
    };

    console.log('Environment check:', envCheck);

    // Format private key for JWT creation
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ?.replace(/\\n/g, '\n')
      .replace(/^"(.*)"$/, '$1');

    // We'll use the built-in fetch API instead of google-apis
    // First, get an access token

    const tokenEndpoint = 'https://oauth2.googleapis.com/token';
    const now = Math.floor(Date.now() / 1000);
    const expiryTime = now + 3600; // 1 hour from now

    // Create a JWT claim
    const jwtClaim = {
      iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: tokenEndpoint,
      exp: expiryTime,
      iat: now
    };

    // Encode JWT header and claim
    const header = { alg: 'RS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedClaim = Buffer.from(JSON.stringify(jwtClaim)).toString('base64url');

    // Import crypto module
    const crypto = require('crypto');

    // Create signature
    const signatureInput = `${encodedHeader}.${encodedClaim}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signatureInput);
    signer.end();
    const signature = signer.sign(privateKey, 'base64url');

    // Assemble JWT
    const jwt = `${encodedHeader}.${encodedClaim}.${signature}`;

    // Get access token
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token: ' + JSON.stringify(tokenData));
    }

    console.log('Successfully obtained access token');

    // Now use the token to access Google Sheets API
    const sheetsEndpoint = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_ID}?fields=sheets.properties.title`;

    const sheetsResponse = await fetch(sheetsEndpoint, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const sheetsData = await sheetsResponse.json();
    console.log('Sheets API response:', JSON.stringify(sheetsData));

    // Check if 'subscribers' sheet exists
    const sheets = sheetsData.sheets || [];
    const sheetNames = sheets.map(sheet => sheet.properties?.title).filter(Boolean);
    const subscribersExists = sheetNames.includes('subscribers');

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Google Sheets API',
      sheets: sheetNames,
      subscribersSheetExists: subscribersExists
    });
  } catch (error) {
    console.error('Error testing Google Sheets API:', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}