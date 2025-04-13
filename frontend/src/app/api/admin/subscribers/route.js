// src/app/api/admin/subscribers/route.js
import { createClient } from 'redis';
import { NextResponse } from 'next/server';

// Create Redis client
const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL || process.env.KV_REST_API_URL
  });

  await client.connect();
  return client;
};

export async function GET() {
  let client;

  try {
    // Connect to Redis
    client = await getRedisClient();

    // Get all subscribers
    const subscribers = await client.hGetAll('subscribers');

    // Format as array with timestamps
    const subscriberList = Object.entries(subscribers || {}).map(([email, timestamp]) => ({
      email,
      subscribed_at: timestamp
    }));

    // Sort by timestamp (newest first)
    subscriberList.sort((a, b) =>
      new Date(b.subscribed_at) - new Date(a.subscribed_at)
    );

    return NextResponse.json({
      success: true,
      count: subscriberList.length,
      subscribers: subscriberList
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  } finally {
    // Close Redis connection
    if (client) {
      await client.quit().catch(console.error);
    }
  }
}