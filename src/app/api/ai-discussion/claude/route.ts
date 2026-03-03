import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const { system, prompt } = await request.json();
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: prompt }],
    });
    return Response.json({ text: (message.content[0] as { text: string }).text });
  } catch (error) {
    console.error("Claude API error:", error);
    return Response.json({ error: "Claude API failed", text: "I was unable to respond at this time." }, { status: 500 });
  }
}
