// src/app/api/tools/route.js
import { NextResponse } from 'next/server';

// Hard-coded tools data
const toolsData = [
  {
    "id": "1",
    "name": "ChatGPT",
    "source_url": "https://chatgpt.com/",
    "short_description": "Google’s AI assistant for brainstorming, Q&A, and content support.",
    "screenshot_url": "/screenshots/chatgpt.png",
    "category": "Foundational AI",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "2",
    "name": "Claude",
    "source_url": "https://claude.ai/",
    "short_description": "AI-powered web search with real-time answers via Bing Chat.",
    "screenshot_url": "/screenshots/claude.png",
    "category": "Foundational AI",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "3",
    "name": "Perplexity",
    "source_url": "https://www.perplexity.ai/",
    "short_description": "AI chatbot with web-sourced answers and creative capabilities.",
    "screenshot_url": "/screenshots/perplexity.png",
    "category": "Foundational AI",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "4",
    "name": "Copilot",
    "source_url": "https://copilot.microsoft.com/",
    "short_description": "Conversational AI assistant focused on thoughtful dialogue and mental clarity.",
    "screenshot_url": "/screenshots/copilot.png",
    "category": "Foundational AI",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "5",
    "name": "Gemini",
    "source_url": "https://gemini.google.com/",
    "short_description": "Open-source chatbot powered by Hugging Face language models.",
    "screenshot_url": "/screenshots/gemini.png",
    "category": "Foundational AI",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "6",
    "name": "DeepSeek",
    "source_url": "https://www.deepseek.com/",
    "short_description": "Real-time AI chatbot with web and image generation capabilities.",
    "screenshot_url": "/screenshots/deepseek.png",
    "category": "Foundational AI",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "7",
    "name": "Jasper",
    "source_url": "https://www.jasper.ai",
    "short_description": "AI copywriter for blogs, marketing, and social media content.",
    "screenshot_url": "/screenshots/jasper.png",
    "category": "Writing & Editing",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "8",
    "name": "Copy.ai",
    "source_url": "https://www.copy.ai",
    "short_description": "Templates for sales copy, email, product descriptions, and more.",
    "screenshot_url": "/screenshots/copy.ai.png",
    "category": "Writing & Editing",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "9",
    "name": "Rytr",
    "source_url": "https://rytr.me",
    "short_description": "Budget-friendly AI writing assistant for fast drafting and editing.",
    "screenshot_url": "/screenshots/rytr.png",
    "category": "Writing & Editing",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "10",
    "name": "GrammarlyGO",
    "source_url": "https://www.grammarly.com",
    "short_description": "AI-powered writing assistant that rewrites, summarizes, and ideates.",
    "screenshot_url": "/screenshots/grammarlygo.png",
    "category": "Writing & Editing",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "11",
    "name": "Wordtune",
    "source_url": "https://www.wordtune.com",
    "short_description": "Rephrasing tool that improves tone, clarity, and impact.",
    "screenshot_url": "/screenshots/wordtune.png",
    "category": "Writing & Editing",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "12",
    "name": "Sudowrite",
    "source_url": "https://www.sudowrite.com",
    "short_description": "Creative AI writer to help with storytelling and idea generation.",
    "screenshot_url": "/screenshots/sudowrite.png",
    "category": "Writing & Editing",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "13",
    "name": "Otter.ai",
    "source_url": "https://otter.ai",
    "short_description": "Transcribes and summarizes meetings in real-time.",
    "screenshot_url": "/screenshots/otter.ai.png",
    "category": "Meeting Assistants",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "14",
    "name": "Fireflies.ai",
    "source_url": "https://fireflies.ai",
    "short_description": "AI meeting recorder with notes, summaries, and topic detection.",
    "screenshot_url": "/screenshots/fireflies.ai.png",
    "category": "Meeting Assistants",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "15",
    "name": "Fathom",
    "source_url": "https://fathom.video",
    "short_description": "Zoom and Meet notetaker with highlight tagging and sharing.",
    "screenshot_url": "/screenshots/fathom.png",
    "category": "Meeting Assistants",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "16",
    "name": "tl;dv",
    "source_url": "https://tldv.io",
    "short_description": "Tag and search meeting recordings, integrated with major platforms.",
    "screenshot_url": "/screenshots/tl;dv.png",
    "category": "Meeting Assistants",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "17",
    "name": "Avoma",
    "source_url": "https://www.avoma.com",
    "short_description": "Full meeting assistant with transcription, insights, and action items.",
    "screenshot_url": "/screenshots/avoma.png",
    "category": "Meeting Assistants",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "18",
    "name": "Supernormal",
    "source_url": "https://www.supernormal.com",
    "short_description": "Auto-generates meeting notes, tasks, and summaries.",
    "screenshot_url": "/screenshots/supernormal.png",
    "category": "Meeting Assistants",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "19",
    "name": "Tome",
    "source_url": "https://tome.app",
    "short_description": "Generate professional decks and narratives from prompts.",
    "screenshot_url": "/screenshots/tome.png",
    "category": "Deck Automation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "20",
    "name": "Gamma",
    "source_url": "https://gamma.app",
    "short_description": "Create AI-powered presentations or one-pagers in minutes.",
    "screenshot_url": "/screenshots/gamma.png",
    "category": "Deck Automation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "21",
    "name": "Beautiful.ai",
    "source_url": "https://www.beautiful.ai",
    "short_description": "Design presentations quickly with smart templates.",
    "screenshot_url": "/screenshots/beautiful.ai.png",
    "category": "Deck Automation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "22",
    "name": "Decktopus",
    "source_url": "https://www.decktopus.com",
    "short_description": "Automated deck builder that adds content and formatting.",
    "screenshot_url": "/screenshots/decktopus.png",
    "category": "Deck Automation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "23",
    "name": "Plus AI",
    "source_url": "https://www.plus.ai",
    "short_description": "Slide generator for Google Slides & PowerPoint.",
    "screenshot_url": "/screenshots/plus_ai.png",
    "category": "Deck Automation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "24",
    "name": "Canva",
    "source_url": "https://www.canva.com",
    "short_description": "Auto-design slide decks using brand elements and copy.",
    "screenshot_url": "/screenshots/canva.png",
    "category": "Deck Automation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "25",
    "name": "Midjourney",
    "source_url": "https://www.midjourney.com",
    "short_description": "Generate stunning images for branding, merch, or social.",
    "screenshot_url": "/screenshots/midjourney.png",
    "category": "Content Creation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "26",
    "name": "Bing ",
    "source_url": "https://www.bing.com/create",
    "short_description": "DALL·E 3-powered tool for custom AI illustrations.",
    "screenshot_url": "/screenshots/bing_.png",
    "category": "Content Creation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "27",
    "name": "Synthesia",
    "source_url": "https://www.synthesia.io",
    "short_description": "Turn text into AI videos with avatars for internal comms or fan videos.",
    "screenshot_url": "/screenshots/synthesia.png",
    "category": "Content Creation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "28",
    "name": "Runway",
    "source_url": "https://runwayml.com",
    "short_description": "Edit or generate videos using Gen-2 and AI effects.",
    "screenshot_url": "/screenshots/runway.png",
    "category": "Content Creation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "29",
    "name": "Descript",
    "source_url": "https://www.descript.com",
    "short_description": "Text-based video/audio editor with screen recording & voice cloning.",
    "screenshot_url": "/screenshots/descript.png",
    "category": "Content Creation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "30",
    "name": "Adobe Firefly",
    "source_url": "https://firefly.adobe.com",
    "short_description": "Generate branded visuals and effects using prompts.",
    "screenshot_url": "/screenshots/adobe_firefly.png",
    "category": "Content Creation",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "31",
    "name": "Motion",
    "source_url": "https://www.usemotion.com",
    "short_description": "AI calendar that schedules tasks and meetings automatically.",
    "screenshot_url": "/screenshots/motion.png",
    "category": "Task & Workflow",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "32",
    "name": "Reclaim.ai",
    "source_url": "https://reclaim.ai",
    "short_description": "Auto-schedules tasks and routines into your calendar.",
    "screenshot_url": "/screenshots/reclaim.ai.png",
    "category": "Task & Workflow",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "33",
    "name": "Clockwise",
    "source_url": "https://www.getclockwise.com",
    "short_description": "Calendar optimizer that creates more focus time.",
    "screenshot_url": "/screenshots/clockwise.png",
    "category": "Task & Workflow",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "34",
    "name": "Magical",
    "source_url": "https://www.getmagical.com",
    "short_description": "Automate form-filling, email replies, and workflows with text prompts.",
    "screenshot_url": "/screenshots/magical.png",
    "category": "Task & Workflow",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "35",
    "name": "Notion AI",
    "source_url": "https://www.notion.so",
    "short_description": "Smart AI assistant inside Notion to summarize and answer.",
    "screenshot_url": "/screenshots/notion_ai.png",
    "category": "Task & Workflow",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "36",
    "name": "Sunsama",
    "source_url": "https://sunsama.com",
    "short_description": "Daily planner that helps prioritize, plan, and reflect on goals.",
    "screenshot_url": "/screenshots/sunsama.png",
    "category": "Task & Workflow",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "37",
    "name": "Elicit",
    "source_url": "https://elicit.org",
    "short_description": "Research assistant that reviews academic papers and finds insights.",
    "screenshot_url": "/screenshots/elicit.png",
    "category": "Research & Analysis",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "38",
    "name": "Perplexity",
    "source_url": "https://www.perplexity.ai",
    "short_description": "Search engine with citations and real-time knowledge.",
    "screenshot_url": "/screenshots/perplexity.png",
    "category": "Research & Analysis",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "39",
    "name": "Humata",
    "source_url": "https://humata.ai",
    "short_description": "Ask questions and summarize long PDFs instantly.",
    "screenshot_url": "/screenshots/humata.png",
    "category": "Research & Analysis",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "40",
    "name": "SciSpace",
    "source_url": "https://www.scispace.com",
    "short_description": "Understand and query scientific papers in plain English.",
    "screenshot_url": "/screenshots/scispace.png",
    "category": "Research & Analysis",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "41",
    "name": "Genein",
    "source_url": "https://www.genei.io",
    "short_description": "Summarizes articles and extracts key points for fast reading.",
    "screenshot_url": "/screenshots/genein.png",
    "category": "Research & Analysis",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "42",
    "name": "Wolfram",
    "source_url": "https://www.wolframalpha.com",
    "short_description": "Computational engine for data, stats, and analytics.",
    "screenshot_url": "/screenshots/wolfram.png",
    "category": "Research & Analysis",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "43",
    "name": "ElevenLabs",
    "source_url": "https://elevenlabs.io",
    "short_description": "High-fidelity text-to-speech with voice cloning.",
    "screenshot_url": "/screenshots/elevenlabs.png",
    "category": "Voice & Audio",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "44",
    "name": "Murf.ai",
    "source_url": "https://murf.ai",
    "short_description": "Create studio-quality voiceovers in multiple accents/languages.",
    "screenshot_url": "/screenshots/murf.ai.png",
    "category": "Voice & Audio",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "45",
    "name": "Resemble AI",
    "source_url": "https://www.resemble.ai",
    "short_description": "Clone voices and generate custom speech with APIs.",
    "screenshot_url": "/screenshots/resemble_ai.png",
    "category": "Voice & Audio",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "46",
    "name": "Speechify",
    "source_url": "https://speechify.com",
    "short_description": "Turn any text into spoken word with natural narration.",
    "screenshot_url": "/screenshots/speechify.png",
    "category": "Voice & Audio",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "47",
    "name": "Krisp",
    "source_url": "https://krisp.ai",
    "short_description": "Remove background noise and echo in real-time.",
    "screenshot_url": "/screenshots/krisp.png",
    "category": "Voice & Audio",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "48",
    "name": "Play.ht",
    "source_url": "https://play.ht",
    "short_description": "Generate podcast-quality speech from text or scripts.",
    "screenshot_url": "/screenshots/play.ht.png",
    "category": "Voice & Audio",
    "type": "personal",
    "sector": "N/A"
  },
  {
    "id": "52",
    "name": "Sports Innovation Lab",
    "source_url": "https://sportsilab.com",
    "short_description": "Analyzes fan behavior data to drive sponsorship and engagement strategy.",
    "screenshot_url": "/screenshots/sports_innovation_lab.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Fan Intelligence"
  },
  {
    "id": "57",
    "name": "Pixellot",
    "source_url": "https://pixellot.tv",
    "short_description": "AI-powered sports video production automating live broadcasting.",
    "screenshot_url": "/screenshots/pixellot.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Advertising & Media"
  },
  {
    "id": "58",
    "name": "PixelScope",
    "source_url": "https://pxscope.com",
    "short_description": "Autonomous camera system that tracks action and produces live sports broadcasts.",
    "screenshot_url": "/screenshots/pixelscope.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Advertising & Media"
  },
  {
    "id": "59",
    "name": "Reely",
    "source_url": "https://reelyai.com/",
    "short_description": "AI clips real-time sports highlights for social media sharing.",
    "screenshot_url": "/screenshots/reely.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Advertising & Media"
  },
  {
    "id": "60",
    "name": "Veritone",
    "source_url": "https://veritone.com",
    "short_description": "AI tools for content tagging, management, and highlight generation.",
    "screenshot_url": "/screenshots/veritone.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Advertising & Media"
  },
  {
    "id": "61",
    "name": "Supponor",
    "source_url": "https://supponor.com",
    "short_description": "AI overlays virtual ads onto live sports broadcasts.",
    "screenshot_url": "/screenshots/supponor.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Advertising & Media"
  },
  {
    "id": "62",
    "name": "Veo",
    "source_url": "https://www.veo.co",
    "short_description": "AI-powered sports camera platform automating recording and highlight creation.",
    "screenshot_url": "/screenshots/veo.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Advertising & Media"
  },
  {
    "id": "63",
    "name": "Sponix",
    "source_url": "https://sponixtech.com",
    "short_description": "Provides AI-driven immersive replays and virtual advertising overlays.",
    "screenshot_url": "/screenshots/sponix.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Advertising & Media"
  },
  {
    "id": "64",
    "name": "StreamLayer",
    "source_url": "https://streamlayer.io",
    "short_description": "Adds real-time interactivity and personalized ads to live sports streams.",
    "screenshot_url": "/screenshots/streamlayer.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Advertising & Media"
  },
  {
    "id": "65",
    "name": "Machina Sports",
    "source_url": "https://machina.gg",
    "short_description": "Generative AI platform creating personalized newsfeeds and fan content.",
    "screenshot_url": "/screenshots/machina_sports.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Creative & Personalization"
  },
  {
    "id": "66",
    "name": "Mobius Labs",
    "source_url": "https://www.mobiuslabs.com",
    "short_description": "AI video tagging for fast personalized highlight generation.",
    "screenshot_url": "/screenshots/mobius_labs.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Creative & Personalization"
  },
  {
    "id": "67",
    "name": "Magnifi",
    "source_url": "https://magnifi.ai",
    "short_description": "AI auto-generates sports highlight videos and social clips.",
    "screenshot_url": "/screenshots/magnifi.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Creative & Personalization"
  },
  {
    "id": "68",
    "name": "Artlist",
    "source_url": "https://artlist.io",
    "short_description": "Royalty-free creative content platform with AI-powered recommendations.",
    "screenshot_url": "/screenshots/artlist.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Creative & Personalization"
  },
  {
    "id": "69",
    "name": "WSC Sports",
    "source_url": "https://wsc-sports.com",
    "short_description": "Automates video highlights using AI to personalize content for fans.",
    "screenshot_url": "/screenshots/wsc_sports.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Creative & Personalization"
  },
  {
    "id": "70",
    "name": "Beyond Sports",
    "source_url": "https://beyondsports.nl",
    "short_description": "Creates 3D sports simulations using AI and live match data.",
    "screenshot_url": "/screenshots/beyond_sports.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Creative & Personalization"
  },
  {
    "id": "71",
    "name": "Synthesia",
    "source_url": "https://www.synthesia.io",
    "short_description": "Creates AI avatar videos from text to automate video production.",
    "screenshot_url": "/screenshots/synthesia.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Creative & Personalization"
  },
  {
    "id": "72",
    "name": "IBM (Watson)",
    "source_url": "https://www.ibm.com/sports",
    "short_description": "AI-driven analytics and automated content for fan engagement.",
    "screenshot_url": "/screenshots/ibm_(watson).png",
    "category": "None",
    "type": "enterprise",
    "sector": "Creative & Personalization"
  },
  {
    "id": "73",
    "name": "Wehave",
    "source_url": "https://wehave.io",
    "short_description": "AI-driven fan analytics platform to optimize sponsorship and marketing.",
    "screenshot_url": "/screenshots/wehave.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Sponsorship & Revenue"
  },
  {
    "id": "74",
    "name": "SponsWatch",
    "source_url": "https://sponswatch.com",
    "short_description": "AI tracks brand exposure across all sports media for sponsorship analytics.",
    "screenshot_url": "/screenshots/sponswatch.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Sponsorship & Revenue"
  },
  {
    "id": "75",
    "name": "Providential Media Group",
    "source_url": "https://providentialmedia.com",
    "short_description": "Combines fan experiences and AI analytics to measure brand engagement.",
    "screenshot_url": "/screenshots/providential_media_group.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Sponsorship & Revenue"
  },
  {
    "id": "76",
    "name": "FanAI",
    "source_url": "https://fan.ai",
    "short_description": "AI platform that links fan data to revenue outcomes for sponsorship ROI.",
    "screenshot_url": "/screenshots/fanai.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Sponsorship & Revenue"
  },
  {
    "id": "77",
    "name": "Relo Metrics",
    "source_url": "https://relometrics.com",
    "short_description": "Uses AI to measure brand exposure and sponsorship value in media.",
    "screenshot_url": "/screenshots/relo_metrics.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Sponsorship & Revenue"
  },
  {
    "id": "78",
    "name": "Blinkfire Analytics",
    "source_url": "https://blinkfire.com",
    "short_description": "Tracks and values sponsor exposure in digital content using AI.",
    "screenshot_url": "/screenshots/blinkfire_analytics.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Sponsorship & Revenue"
  },
  {
    "id": "79",
    "name": "SponsorPulse",
    "source_url": "https://sponsorpulse.com",
    "short_description": "Consumer insights platform to evaluate and optimize sponsorships.",
    "screenshot_url": "/screenshots/sponsorpulse.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Sponsorship & Revenue"
  },
  {
    "id": "80",
    "name": "Nielsen Sports",
    "source_url": "https://nielsensports.com",
    "short_description": "AI-enhanced media valuation and sponsorship performance analytics.",
    "screenshot_url": "/screenshots/nielsen_sports.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Sponsorship & Revenue"
  },
  {
    "id": "81",
    "name": "Second Spectrum",
    "source_url": "https://secondspectrum.com",
    "short_description": "AI and computer vision platform for advanced in-game analytics.",
    "screenshot_url": "/screenshots/second_spectrum.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Measurement & Analytics"
  },
  {
    "id": "82",
    "name": "Stats Perform",
    "source_url": "https://statsperform.com",
    "short_description": "Applies AI to generate predictive insights and real-time stats.",
    "screenshot_url": "/screenshots/stats_perform.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Measurement & Analytics"
  },
  {
    "id": "83",
    "name": "Hawk-Eye Innovations",
    "source_url": "https://hawkeyeinnovations.com",
    "short_description": "AI and vision systems for refereeing and game data visualization.",
    "screenshot_url": "/screenshots/hawk-eye_innovations.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Measurement & Analytics"
  },
  {
    "id": "84",
    "name": "Zone7",
    "source_url": "https://zone7.ai",
    "short_description": "Predictive AI models for injury risk and workload management.",
    "screenshot_url": "/screenshots/zone7.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Measurement & Analytics"
  },
  {
    "id": "85",
    "name": "Kitman Labs",
    "source_url": "https://kitmanlabs.com",
    "short_description": "AI platform for player performance and health optimization.",
    "screenshot_url": "/screenshots/kitman_labs.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Measurement & Analytics"
  },
  {
    "id": "86",
    "name": "Soccerment",
    "source_url": "https://soccerment.com",
    "short_description": "AI platform for advanced football analytics and player development.",
    "screenshot_url": "/screenshots/soccerment.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Measurement & Analytics"
  },
  {
    "id": "87",
    "name": "RespoVision",
    "source_url": "https://respo.vision",
    "short_description": "AI transforms sports video into 3D tracking data for deep analytics.",
    "screenshot_url": "/screenshots/respovision.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Measurement & Analytics"
  },
  {
    "id": "88",
    "name": "Sportlogiq",
    "source_url": "https://sportlogiq.com",
    "short_description": "AI and computer vision sports analytics platform for advanced metrics.",
    "screenshot_url": "/screenshots/sportlogiq.png",
    "category": "None",
    "type": "enterprise",
    "sector": "Measurement & Analytics"
  }
];

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector') || '';
    const type = searchParams.get('type') || 'personal';

    console.log(`API Request - Sector: ${sector}, Type: ${type}`);

    // Filter the tools
    let filteredTools = toolsData;

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
    return NextResponse.json([], { status: 500 });
  }
}