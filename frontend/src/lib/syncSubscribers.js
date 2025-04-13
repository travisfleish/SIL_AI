// src/lib/syncSubscribers.js
const { google } = require('googleapis');
const fetch = require('node-fetch');

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
      return { success: true, message: 'No subscribers to sync', count: 0 };
    }

    // 2. Format the data to match sheet structure
    const subscriberRows = data.subscribers.map(sub => [
      sub.email,
      sub.subscribed_at
    ]);

    console.log(`Found ${subscriberRows.length} subscribers to sync`);

    // 3. Authenticate with Google Sheets
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    if (!serviceAccountEmail) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable is missing');
    }

    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('GOOGLE_PRIVATE_KEY environment variable is missing');
    }

    // Format private key
    privateKey = privateKey.replace(/\\n/g, '\n');
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }

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

    const sheetId = process.env.SHEET_ID;
    if (!sheetId) {
      throw new Error('SHEET_ID environment variable is missing');
    }

    // Write data to sheet
    if (subscriberRows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'Sheet1!A2',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: subscriberRows },
      });
    }

    console.log(`Successfully synced ${subscriberRows.length} subscribers to Google Sheets`);
    return { success: true, message: `Synced ${subscriberRows.length} subscribers to Google Sheets`, count: subscriberRows.length };

  } catch (error) {
    console.error('Error during sync process:', error);
    throw error;
  }
}

module.exports = { syncSubscribersToGoogleSheet };