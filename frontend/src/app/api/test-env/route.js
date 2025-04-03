// app/api/test-env/route.js
export async function GET() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ?.replace(/\\n/g, '\n')
      .replace(/^"(.*)"$/, '$1');

    return Response.json({
      success: true,
      environment: process.env.NODE_ENV,
      envCheck: {
        hasSheetId: Boolean(process.env.SHEET_ID),
        hasEmail: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
        hasKey: Boolean(process.env.GOOGLE_PRIVATE_KEY),
        nodeVersion: process.version,
        privateKeyStartsWith: privateKey ? privateKey.substring(0, 27) + '...' : null,
        privateKeyLength: privateKey ? privateKey.length : 0
      }
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}