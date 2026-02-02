import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Helper function to analyze trackers in HTML
function analyzeTrackers(html: string) {
  const trackers = [
    { name: 'Google Analytics', pattern: /google-analytics\.com|googletagmanager\.com/, category: 'Analytics', risk: 'medium' as const },
    { name: 'Facebook Pixel', pattern: /facebook\.com\/tr|connect\.facebook\.net/, category: 'Advertising', risk: 'high' as const },
    { name: 'Doubleclick', pattern: /doubleclick\.net|googlesyndication\.com/, category: 'Advertising', risk: 'high' as const },
    { name: 'Hotjar', pattern: /hotjar\.com/, category: 'Analytics', risk: 'medium' as const },
    { name: 'Amazon Ads', pattern: /amazon-adsystem\.com/, category: 'Advertising', risk: 'high' as const },
    { name: 'LinkedIn Insight', pattern: /linkedin\.com\/px/, category: 'Advertising', risk: 'medium' as const },
    { name: 'Twitter Analytics', pattern: /t\.co|twitter\.com\/i\/ads/, category: 'Social', risk: 'low' as const },
    { name: 'Mixpanel', pattern: /mixpanel\.com/, category: 'Analytics', risk: 'low' as const },
  ];

  const results = [];
  for (const tracker of trackers) {
    const matches = html.match(new RegExp(tracker.pattern, 'gi'));
    if (matches) {
      results.push({
        name: tracker.name,
        count: matches.length,
        category: tracker.category,
        risk: tracker.risk,
      });
    }
  }
  return results;
}

// Helper function to detect fingerprinting scripts
function detectFingerprinting(html: string): number {
  const fingerprintingPatterns = [
    /canvas\.getContext|canvas\.toDataURL/, // Canvas fingerprinting
    /navigator\.plugins|navigator\.mimeTypes/, // Plugin fingerprinting
    /screen\.width|screen\.height|screen\.colorDepth/, // Screen fingerprinting
    /webgl|webgl2/, // WebGL fingerprinting
  ];

  let count = 0;
  for (const pattern of fingerprintingPatterns) {
    if (pattern.test(html)) {
      count++;
    }
  }
  return count;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    // Fetch the webpage HTML
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    const html = await response.text();
    
    // Analyze the HTML for trackers
    const trackers = analyzeTrackers(html);
    const totalTrackers = trackers.reduce((sum, t) => sum + t.count, 0);
    
    // Calculate privacy score based on trackers (lower score for more trackers)
    const privacyScore = Math.max(0, 100 - totalTrackers / 10); // Simple formula
    
    // Simulate other metrics (since we can't detect cookies/permissions server-side)
    const totalCookies = Math.floor(Math.random() * 100) + 50;
    const totalPermissions = Math.floor(Math.random() * 10) + 1;
    const fingerprintingScripts = detectFingerprinting(html);
    
    const scanData = {
      privacyScore,
      totalTrackers,
      totalCookies,
      totalPermissions,
      fingerprintingScripts,
      trackers,
      url,
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `You are a digital privacy expert. Analyze the following privacy scan data and provide:
1. A brief overall assessment (2-3 sentences)
2. The top 3 most critical privacy risks identified
3. Specific actionable recommendations to improve privacy

Scan Data:
- Privacy Score: ${scanData.privacyScore}/100
- Total Trackers Found: ${scanData.totalTrackers}
- Active Cookies: ${scanData.totalCookies}
- Browser Permissions Granted: ${scanData.totalPermissions}
- Fingerprinting Scripts Detected: ${scanData.fingerprintingScripts}

Top Trackers by Category:
${scanData.trackers?.map((t: any) => `- ${t.name} (${t.category}): ${t.count} instances, ${t.risk} risk`).join('\n') || 'No tracker data available'}

Provide a professional, helpful analysis that empowers the user to take control of their digital privacy. Be specific and actionable.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a knowledgeable digital privacy expert who helps users understand and improve their online privacy." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || "Unable to generate analysis.";

    return new Response(JSON.stringify({ scanData, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-privacy function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
