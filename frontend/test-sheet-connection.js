// env-sheets-test.js
require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

async function testEnvSheetConnection() {
  try {
    console.log('Testing Google Sheets API connection using environment variables...');

    // Log environment variables (with private key truncated for security)
    console.log('\nEnvironment variables check:');
    console.log(`GOOGLE_SERVICE_ACCOUNT_EMAIL: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    console.log(`SHEET_ID: ${process.env.SHEET_ID}`);
    const keyPreview = process.env.GOOGLE_PRIVATE_KEY
      ? `${process.env.GOOGLE_PRIVATE_KEY.substring(0, 20)}...${process.env.GOOGLE_PRIVATE_KEY.substring(process.env.GOOGLE_PRIVATE_KEY.length - 20)}`
      : 'Not found';
    console.log(`GOOGLE_PRIVATE_KEY: ${keyPreview}`);

    // Create JWT client
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    // Initialize the sheets API
    const sheets = google.sheets({ version: 'v4', auth });

    // Get spreadsheet info using SHEET_ID from .env.local
    const sheetId = process.env.SHEET_ID;
    console.log(`\nAttempting to access sheet with ID from .env.local: ${sheetId}`);

    // Get spreadsheet metadata
    const metadataResponse = await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    });

    console.log('\nSheet access successful!');
    console.log(`Title: ${metadataResponse.data.properties.title}`);
    console.log(`Sheet count: ${metadataResponse.data.sheets.length}`);

    // List sheet names
    console.log('\nIndividual sheets:');
    metadataResponse.data.sheets.forEach((sheet, index) => {
      console.log(`${index + 1}: ${sheet.properties.title}`);
    });

    // Fetch sample data
    if (metadataResponse.data.sheets.length > 0) {
      const firstSheetTitle = metadataResponse.data.sheets[0].properties.title;

      console.log(`\nFetching sample data from first sheet: "${firstSheetTitle}"`);

      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${firstSheetTitle}!A1:Z5`, // Get first 5 rows, all columns (A-Z)
      });

      if (dataResponse.data.values && dataResponse.data.values.length > 0) {
        console.log('\nSample data:');

        // Get column headers (using first row as headers)
        const headers = dataResponse.data.values[0];
        console.log(`Columns: ${headers.join(' | ')}`);
        console.log('-'.repeat(80)); // Separator line

        // Print data rows with better formatting
        for (let i = 1; i < dataResponse.data.values.length; i++) {
          const row = dataResponse.data.values[i];
          // Pad row with empty strings if it has fewer columns than headers
          while (row.length < headers.length) {
            row.push('');
          }
          console.log(`Row ${i}: ${row.join(' | ')}`);
        }

        // Print row count
        console.log('-'.repeat(80)); // Separator line
        console.log(`Total rows retrieved: ${dataResponse.data.values.length}`);
      } else {
        console.log('No data found in the first sheet.');
      }
    }

  } catch (error) {
    console.error('Sheet access failed:');
    console.error(error.message);

    // More detailed error reporting
    if (error.response) {
      console.error('\nAPI error details:');
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${JSON.stringify(error.response.data)}`);
    }
  }
}

testEnvSheetConnection();