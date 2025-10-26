import { NextRequest } from "next/server";

const REKA_API_KEY = process.env.REKA_API_KEY;
const REKA_API_URL = "https://api.reka.ai/v1/chat";

export async function POST(request: NextRequest) {
  try {
    const { message, currentStep, stepData } = await request.json();

    if (!message || !stepData) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    if (!REKA_API_KEY) {
      console.error("REKA_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500 }
      );
    }

    // SIMPLIFIED - Only pass step ID, title, and description
    const contextualMessage = `You are an assembly assistant for IKEA TOMMARYD furniture.

Context for current step:
- Step ${currentStep}
- Title: "${stepData.title}"
- Description: ${stepData.description}

Answer the user's question based on this context. Keep your response to 2-3 sentences maximum.

User question: ${message}`;

    // Call Reka AI with OpenAI-compatible format
    const response = await fetch(REKA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REKA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "reka-core-20240501",
        messages: [
          {
            role: "user",
            content: contextualMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 512,
        stream: false, // 🚧 Disable streaming for now
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Reka API error:", errorText);
      throw new Error(`Reka API error: ${response.statusText}`);
    }

    // Get the complete response (non-streaming)
    const data = await response.json();
    
    return new Response(
      JSON.stringify({ 
        response: data.responses[0].message.content,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Assembly chat error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500 }
    );
  }
}

