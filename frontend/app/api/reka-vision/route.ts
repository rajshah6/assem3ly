import { NextRequest } from "next/server";

const REKA_API_KEY = process.env.REKA_API_KEY;
const REKA_API_URL = "https://api.reka.ai/v1/chat";

export async function POST(request: NextRequest) {
  try {
    const { message, currentStep, stepData } = await request.json();

    if (!message || !stepData) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    if (!REKA_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
    }

    const visionAnalysis = simulateVisionAnalysis(currentStep, stepData);

    const contextualMessage = `You are an assembly assistant for IKEA TOMMARYD furniture.

Simulated Vision Analysis:
${visionAnalysis}

Context for current step:
- Step ${currentStep}
- Title: "${stepData.title}"
- Description: ${stepData.description}
${stepData.parts ? `- Parts needed: ${stepData.parts.map((p: any) => p.name).join(", ")}` : ""}

Answer the user's question based on this context. Keep your response to 2-3 sentences maximum.

User question: ${message}`;

    const response = await fetch(REKA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${REKA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "reka-core-20240501",
        messages: [{ role: "user", content: contextualMessage }],
        temperature: 0.7,
        max_tokens: 512,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: "Reka API error", detail: errorText }),
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = getTextFromReka(data);

    return new Response(
      JSON.stringify({
        response: text,
        visionContext: visionAnalysis,
        simulated: true,
        timestamp: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to process chat message" }),
      { status: 500 }
    );
  }
}

function getTextFromReka(data: any): string {
  if (
    data &&
    Array.isArray(data.responses) &&
    data.responses[0] &&
    data.responses[0].message &&
    typeof data.responses[0].message.content === "string"
  ) {
    return data.responses[0].message.content;
  }
  if (
    data &&
    Array.isArray(data.choices) &&
    data.choices[0] &&
    data.choices[0].message &&
    typeof data.choices[0].message.content === "string"
  ) {
    return data.choices[0].message.content;
  }
  return "";
}

function simulateVisionAnalysis(stepNum: number, stepData: any): string {
  const visionDescriptions: Record<string, any> = {
    attach: {
      detected: "Shows parts positioned for attachment",
      arrows: "Circular arrow indicates rotation direction",
      tools: "Diagram shows hand gripping tool",
      notes: "Parts aligned at 90-degree angles",
    },
    install: {
      detected: "Parts shown in installation position",
      arrows: "Linear arrow shows insertion direction",
      tools: "Tool icon visible in corner",
      notes: "Ensure flush alignment before tightening",
    },
    connect: {
      detected: "Connection point clearly marked",
      arrows: "Dotted line shows connection path",
      tools: "No special tools required",
      notes: "Friction-fit connection point",
    },
    place: {
      detected: "Parts arranged on flat surface",
      arrows: "Downward arrow indicates placement",
      tools: "Hand illustration shows positioning",
      notes: "Check alignment with frame edges",
    },
    tighten: {
      detected: "Rotational motion indicated",
      arrows: "Curved arrows show tightening direction",
      tools: "Screwdriver icon displayed",
      notes: "Stop when resistance increases",
    },
    align: {
      detected: "Alignment guides visible",
      arrows: "Parallel lines show alignment",
      tools: "Optional measuring tool",
      notes: "Use provided markings as reference",
    },
  };

  const stepText = `${stepData?.title ?? ""} ${stepData?.description ?? ""}`.toLowerCase();

  let matched = visionDescriptions.attach;
  for (const key in visionDescriptions) {
    if (stepText.includes(key)) {
      matched = visionDescriptions[key];
      break;
    }
  }

  return `- Visual content: ${matched.detected}
- Motion indicators: ${matched.arrows}
- Tool detection: ${matched.tools}
- Spatial notes: ${matched.notes}`;
}

