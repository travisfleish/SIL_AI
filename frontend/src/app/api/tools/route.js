// app/api/tools/route.js
import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/sheets';

// Define Node.js runtime to avoid edge runtime issues
export const runtime = 'nodejs';

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

    // If no tools were fetched, provide fallback data
    if (!allTools.length) {
      console.log('No tools returned from getSheetData, using fallback data');
      return NextResponse.json(getFallbackTools(sector, type));
    }

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

    // Return fallback data instead of an error
    console.log('Using fallback data due to error');
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector') || '';
    const type = searchParams.get('type') || 'personal';

    return NextResponse.json(getFallbackTools(sector, type));
  }
}

// Fallback data function to provide sample tools if the API fails
function getFallbackTools(sector, type) {
  // Basic fallback tools covering different categories
  const fallbackTools = [
    {
      id: "chatgpt",
      name: "ChatGPT",
      source_url: "https://chat.openai.com",
      short_description: "OpenAI's assistant for brainstorming, Q&A, and content support.",
      screenshot_url: "/default-screenshot.png",
      category: "foundational-ai",
      type: "personal",
      sector: "Foundational AI"
    },
    {
      id: "jasper",
      name: "Jasper",
      source_url: "https://www.jasper.ai",
      short_description: "AI copywriter for blogs, marketing, and social media content.",
      screenshot_url: "/default-screenshot.png",
      category: "writing-editing",
      type: "personal",
      sector: "Writing & Editing"
    },
    {
      id: "otter",
      name: "Otter.ai",
      source_url: "https://otter.ai",
      short_description: "Transcribes and summarizes meetings in real-time.",
      screenshot_url: "/default-screenshot.png",
      category: "meeting-assistants",
      type: "personal",
      sector: "Meeting Assistants"
    },
    {
      id: "gamma",
      name: "Gamma",
      source_url: "https://gamma.app",
      short_description: "AI-powered presentation and deck creation tool.",
      screenshot_url: "/default-screenshot.png",
      category: "deck-automation",
      type: "personal",
      sector: "Deck Automation"
    },
    {
      id: "midjourney",
      name: "Midjourney",
      source_url: "https://midjourney.com",
      short_description: "AI image generation for creative visuals and concepts.",
      screenshot_url: "/default-screenshot.png",
      category: "content-creation",
      type: "personal",
      sector: "Content Creation"
    },
    {
      id: "perplexity",
      name: "Perplexity AI",
      source_url: "https://perplexity.ai",
      short_description: "AI research assistant that provides citational responses.",
      screenshot_url: "/default-screenshot.png",
      category: "research-analysis",
      type: "personal",
      sector: "Research & Analysis"
    }
  ];

  // Enterprise tools
  const enterpriseTools = [
    {
      id: "anthropic-claude",
      name: "Anthropic Claude",
      source_url: "https://anthropic.com",
      short_description: "Enterprise-grade AI assistant for business applications.",
      screenshot_url: "/default-screenshot.png",
      category: "foundational-ai",
      type: "enterprise",
      sector: "Foundational AI"
    },
    {
      id: "adobe-firefly",
      name: "Adobe Firefly",
      source_url: "https://adobe.com/firefly",
      short_description: "Enterprise creative image and design generation.",
      screenshot_url: "/default-screenshot.png",
      category: "creative-personalization",
      type: "enterprise",
      sector: "Creative & Personalization"
    }
  ];

  // Combine all tools
  const allTools = [...fallbackTools, ...enterpriseTools];

  // Filter by type
  const mappedType = type === 'new' ? 'personal' : type;
  let filteredTools = allTools.filter(tool =>
    tool.type.toLowerCase() === mappedType.toLowerCase()
  );

  // Filter by sector if provided
  if (sector && sector !== '') {
    filteredTools = filteredTools.filter(tool =>
      tool.sector && tool.sector.toLowerCase().includes(sector.toLowerCase())
    );
  }

  return filteredTools;
}