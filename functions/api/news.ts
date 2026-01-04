import { GoogleGenAI, Type } from "@google/genai";

const extractJson = (text: string) => {
  let t = text.trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  
  const start = t.indexOf('{');
  if (start === -1) throw new Error("Format error");
  let jsonStr = t.substring(start);
  
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    const lastBrace = jsonStr.lastIndexOf('}');
    if (lastBrace === -1) throw new Error("Briefing interrupted.");
    
    let partial = jsonStr.substring(0, lastBrace + 1);
    if (partial.includes('"articles"') && !partial.endsWith(']}')) {
      partial = partial.replace(/,\s*$/, '') + ']}';
    }
    
    try {
      return JSON.parse(partial);
    } catch (innerE) {
      throw new Error("Briefing corrupted.");
    }
  }
};

export async function onRequest(context) {
  const { env, request } = context;
  const API_KEY = env.API_KEY || env.GEMINI_API_KEY;

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API Key missing in server configuration." }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  }

  // FIX: Implement Cloudflare Cache API
  const cacheUrl = new URL(request.url);
  const cacheKey = new Request(cacheUrl.toString(), request);
  // Fix: Property 'default' does not exist on type 'CacheStorage'.
  const cache = (caches as any).default;
  
  // Try to find a cached response
  let response = await cache.match(cacheKey);
  if (response) {
    return response;
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Upgraded prompt to match client-side quality standards
  const prompt = `Current Date: ${dateStr}. 
    Goal: Identify 15 significant AI developments from the LAST 30 DAYS to populate our news categories.
    Constraints: 
    - Exactly 15 objects in 'articles'.
    - 'content' MUST be a long analytical paragraph (at least 5-6 sentences, approx 600-800 characters) providing deep technical insight.
    - Diversity: MUST provide at least 2 articles for EACH category: RESEARCH, MODELS, TOOLS, STARTUPS, ENTERPRISE, POLICY, HARDWARE, and ROBOTICS.
    - 'sourceUrl' must be a valid direct URL.`;

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        maxOutputTokens: 8192, 
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  excerpt: { type: Type.STRING },
                  content: { type: Type.STRING },
                  category: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING },
                  date: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["title", "excerpt", "content", "category", "sourceUrl", "date", "tags"]
              },
            },
          },
          required: ["articles"],
        },
      },
    });

    const rawText = aiResponse.text || "";
    const data = extractJson(rawText);
    
    const responseData = JSON.stringify({
      articles: data.articles || [],
      sources: (aiResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web).map((c: any) => ({ uri: c.web.uri, title: c.web.title })),
      lastUpdated: dateStr
    });

    // Create a new response with Cache-Control headers
    response = new Response(responseData, {
      headers: {
        "Content-Type": "application/json",
        // Cache for 1 hour (3600 seconds)
        "Cache-Control": "public, max-age=3600"
      }
    });

    // Put into cache
    context.waitUntil(cache.put(cacheKey, response.clone()));

    return response;

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  }
}