// import { NextResponse } from 'next/server';
// import { addSubscriber } from '../../../../lib/sheets';
//
// export async function POST(request) {
//   try {
//     // Get the request body
//     const body = await request.json();
//     const { email } = body;
//
//     if (!email) {
//       return NextResponse.json({ error: 'Email is required' }, { status: 400 });
//     }
//
//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
//     }
//
//     // Add email to Google Sheets
//     const result = await addSubscriber(email);
//
//     if (result.success) {
//       return NextResponse.json({ message: result.message });
//     } else {
//       return NextResponse.json({ error: result.message }, { status: 400 });
//     }
//   } catch (error) {
//     console.error('Error in /api/subscribe:', error);
//     return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
//   }
// }