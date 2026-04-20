const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

function chunkText(text, size = 8000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

export async function explainPaper(text) {
  const chunks = chunkText(text);
  const results = [];
  for (const chunk of chunks) {
    let explanation = "Could not explain this section.";
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{
            role: "user",
            content: `You are an AI research coach. Explain the following section of a research paper in very simple layman terms. Define any complex terms in simple language. Then give a simple 2-3 sentence summary at the end labeled "Summary:". Here is the section: ${chunk}`
          }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        explanation = data.choices?.[0]?.message?.content || "Could not explain this section.";
      } else {
        const errData = await response.json();
        console.error('Groq error:', response.status, errData);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
    results.push({ original: chunk, explanation });
    
    // 1000ms delay between section calls
    await new Promise(r => setTimeout(r, 1000));
  }
  return results;
}