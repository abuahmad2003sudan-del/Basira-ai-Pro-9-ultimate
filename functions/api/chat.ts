export const onRequestPost = async (context) => {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, modelType = "gemini", useSearch = true } = await request.json();

    if (modelType === "groq") {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${env.GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: "أنت بصيرة AI، مستشار قانوني عالمي فصيح." }, { role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      return new Response(JSON.stringify({ text: data.choices[0].message.content }), { headers: corsHeaders });
    } else {
      // تفعيل البحث في جوجل مع Gemini لضمان الدقة العالمية
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: useSearch ? [{ googleSearch: {} }] : []
        }),
      });
      const data = await response.json();
      return new Response(JSON.stringify({ text: data.candidates[0].content.parts[0].text }), { headers: corsHeaders });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
};
