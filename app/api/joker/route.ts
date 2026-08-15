function clean(value: unknown, max = 40) {
  return String(value ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { letter?: string; category?: string };
    const letter = clean(body.letter, 2).toLocaleUpperCase("tr-TR");
    const category = clean(body.category, 24);
    if (!letter || !category) return Response.json({ error: "Harf veya kategori eksik" }, { status: 400 });
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return Response.json({ error: "AI Joker için Groq anahtarı henüz eklenmedi" }, { status: 503 });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        temperature: 0.2,
        max_completion_tokens: 60,
        messages: [
          { role: "system", content: "Türkçe İsim Şehir oyununda yardımcı ol. İstenen kategoriye gerçekten uyan ve verilen harfle başlayan tek bir cevap yaz. Açıklama, noktalama veya tırnak ekleme." },
          { role: "user", content: JSON.stringify({ letter, category }) },
        ],
      }),
    });
    if (!response.ok) throw new Error("Groq isteği başarısız");
    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const answer = clean(data.choices?.[0]?.message?.content, 40).replace(/^['\"]|['\"]$/g, "");
    if (!answer) throw new Error("Boş cevap");
    return Response.json({ answer });
  } catch {
    return Response.json({ error: "AI Joker şu anda cevap üretemedi" }, { status: 500 });
  }
}
