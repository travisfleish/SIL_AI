// redis-to-google.js - Configured to use .env.local
const { google } = require('googleapis');
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' }); // Specifically load from .env.local

async function syncSubscribersToGoogleSheet() {
  console.log('Starting sync process...');

  try {
    // 1. Fetch subscribers from your admin API endpoint
    console.log('Fetching subscribers from API...');
    const apiUrl = process.env.API_URL || 'https://sil-ai.vercel.app/api/admin/subscribers';

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.subscribers || data.subscribers.length === 0) {
      console.log('No subscribers found via API');
      return;
    }

    // 2. Format the data to match your sheet structure exactly - "Email" and "Submission Timestamp"
    const subscriberRows = data.subscribers.map(sub => [
      sub.email,                     // Column A: Email
      sub.subscribed_at              // Column B: Submission Timestamp
    ]);

    console.log(`Found ${subscriberRows.length} subscribers to sync`);

    // 3. Authenticate with Google Sheets - FIXED VERSION
    console.log('Authenticating with Google Sheets...');

    // Debug output to verify environment variables are loaded
    console.log('Environment variables loaded from .env.local:');
    console.log('- SHEET_ID present:', !!process.env.SHEET_ID);
    console.log('- GOOGLE_SERVICE_ACCOUNT_EMAIL present:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('- GOOGLE_PRIVATE_KEY present:', !!process.env.GOOGLE_PRIVATE_KEY?.length);

    // Get service account email from environment
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    if (!serviceAccountEmail) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is missing');
    }

    // Get and format private key from environment
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('GOOGLE_PRIVATE_KEY environment variable is missing');
    }

    // Format private key - ensure it has proper newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }

    // Create explicit credentials object
    const credentials = {
      client_email: serviceAccountEmail,
      private_key: privateKey
    };

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({
      version: 'v4',
      auth: await auth.getClient()
    });

    // Get sheet ID from environment
    const sheetId = process.env.SHEET_ID;
    if (!sheetId) {
      throw new Error('SHEET_ID environment variable is missing');
    }

    // We'll assume the sheet already exists with proper headers based on your screenshot
    console.log('Appending subscriber data to existing sheet...');

    // Write new data without clearing existing data
    if (subscriberRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet1!A2', // Assuming it's the first sheet
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS', // This will add new rows rather than overwriting
        resource: { values: subscriberRows },
      });
    }

    console.log(`Successfully synced ${subscriberRows.length} subscribers to Google Sheets`);

  } catch (error) {
    console.error('Error during sync process:', error);
  }
}

// Run the sync function
syncSubscribersToGoogleSheet()
  .then(() => console.log('Sync process completed'))
  .catch(err => console.error('Sync process failed:', err));