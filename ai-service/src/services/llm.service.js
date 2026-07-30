const { mockAiAnswer } = require("../data/mock-ai-responses");

const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";

function getOpenAiConfig() {
  const baseUrl = (process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required when AI_MODE is openai");
  }

  return { apiKey, baseUrl, model };
}

function extractOutputText(response) {
  if (typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text;
  }

  for (const item of response.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  throw new Error("OpenAI response did not contain output text");
}

function parseJsonOutput(outputText) {
  const jsonText = outputText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(jsonText);
}

async function generateStructuredResponse(prompt, schemaName) {
  if ((process.env.AI_MODE || "openai").toLowerCase() === "mock") {
    return null;
  }

  if (typeof fetch !== "function") {
    throw new Error("Global fetch is not available. Use Node 18 or newer.");
  }

  const { apiKey, baseUrl, model } = getOpenAiConfig();
  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: prompt,
      store: false,
      text: {
        format: { type: "json_object" }
      }
    })
  });

  const responseBody = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = responseBody.error?.message || `OpenAI responded with ${response.status}`;
    throw new Error(message);
  }

  try {
    return parseJsonOutput(extractOutputText(responseBody));
  } catch (error) {
    throw new Error(`${schemaName} response was not valid JSON: ${error.message}`);
  }
}

async function generateTutorAnswer(prompt) {
  const result = await generateStructuredResponse(
    `${prompt}\n\nTra ve JSON duy nhat: {"answer":"string", "confidence":0.0}.`,
    "Tutor"
  );

  if (result === null) {
    return {
      answer: mockAiAnswer.answer,
      confidence: mockAiAnswer.confidence
    };
  }

  if (typeof result.answer !== "string" || !Number.isFinite(result.confidence)) {
    throw new Error("Tutor response must contain answer (string) and confidence (number)");
  }

  return {
    answer: result.answer,
    confidence: Math.max(0, Math.min(1, result.confidence))
  };
}

module.exports = {
  generateStructuredResponse,
  generateTutorAnswer,
  parseJsonOutput
};
