// app/api/tools/route.js
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/sheets';

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector') || '';
    const type = searchParams.get('type') || 'personal'; // 'personal' or 'enterprise'

    console.log(`API Request - Sector: ${sector}, Type: ${type}`);

    // Get all tools from Google Sheets
    const allTools = await getSheetData();

    console.log(`Total tools fetched: ${allTools.length}`);

    // Filter the tools
    let filteredTools = allTools;

    // Map 'new' to 'personal' and 'enterprise' remains as is
    const mappedType = type === 'new' ? 'personal' : type;

    // Filter by type if provided
    if (mappedType) {
      filteredTools = filteredTools.filter(tool =>
        tool.type.toLowerCase() === mappedType.toLowerCase()
      );
      console.log(`After type filter (${mappedType}): ${filteredTools.length} tools`);
    }

    // Filter by sector if provided
    if (sector && sector !== '') {
      filteredTools = filteredTools.filter(tool =>
        tool.sector && tool.sector.toLowerCase().includes(sector.toLowerCase())
      );
      console.log(`After sector filter (${sector}): ${filteredTools.length} tools`);
    }

    return NextResponse.json(filteredTools);
  } catch (error) {
    console.error('Error in /api/tools:', error);
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
  }
}