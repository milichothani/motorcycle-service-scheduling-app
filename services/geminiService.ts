// services/geminiService.ts  (works with Groq real-time)
// FINAL, STABLE, NON-DECOMMISSIONED MODEL

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Helper to call Groq API
async function groqChat(messages: any[]) {
  if (!GROQ_API_KEY) {
    return { error: "Missing GROQ API key in .env file." };
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2-instruct-0905", // ✅ LATEST WORKING MODEL
        messages,
        temperature: 0.6,
        max_tokens: 1200
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = data?.error?.message || res.statusText;
      return { error: `Groq error: ${msg}` };
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    return { text };
  } catch (err: any) {
    return { error: err.message || "Network error calling Groq." };
  }
}

// === Exported function for motorcycle Q&A ===
export const askMotorcycleAI = async (question: string): Promise<string> => {
  const { text, error } = await groqChat([
    {
      role: "system",
      content:
        "You are an expert motorcycle mechanic. Answer clearly using simple language. Provide checks, causes, fixes, and safety notes."
    },
    { role: "user", content: question }
  ]);

  return text ?? error ?? "Unknown Groq error.";
};

// === Exported function for Article Generator ===
export const generateMotorcycleArticle = async (topic: string): Promise<string> => {
  const { text, error } = await groqChat([
    {
      role: "system",
      content:
        "You are a professional motorcycle technician & writer. Write clean Markdown articles."
    },
    {
      role: "user",
      content: `Write a detailed Markdown article about: ${topic}. Include intro, symptoms, maintenance steps, safety notes, and a summary.`
    }
  ]);

  return text ?? error ?? "Unknown Groq error.";
};
