const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";
const { mockAiAnswer, mockQuiz } = require("../data/mock-ai-responses");

function shouldUseOpenAi() {
  if (process.env.AI_MODE === "mock") {
    return false;
  }

  if (process.env.AI_MODE === "openai") {
    return true;
  }

  return Boolean(process.env.OPENAI_API_KEY);
}

function getMockStructuredResponse(schemaName) {
  const normalizedName = String(schemaName || "").toLowerCase();

  if (normalizedName.includes("review")) {
    return {
      review: [
        {
          questionId: "q1",
          explanation:
            "Câu này kiểm tra đúng ý chính trong đoạn đã chọn. Đáp án đúng phản ánh trực tiếp khái niệm được hỏi, còn lựa chọn sai thường nhầm sang vai trò hoặc ví dụ khác."
        }
      ]
    };
  }

  if (normalizedName.includes("quiz")) {
    return mockQuiz;
  }

  if (normalizedName.includes("concept")) {
    return {
      conceptId: mockAiAnswer.conceptId,
      conceptLabel: mockAiAnswer.conceptLabel,
      confidence: mockAiAnswer.confidence
    };
  }

  return {
    answer: mockAiAnswer.answer,
    confidence: mockAiAnswer.confidence
  };
}

function getOpenAiConfig() {
  const baseUrl = (process.env.OPENAI_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is required");
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
  if (!shouldUseOpenAi()) {
    return getMockStructuredResponse(schemaName);
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

async function generateVisionStructuredResponse(prompt, imageDataUrl, schemaName) {
  if (!shouldUseOpenAi()) {
    return {
      selectedText: "Vùng khoanh là ảnh/slide đã được chọn. Hãy bật AI_MODE=openai và OPENAI_API_KEY để OCR hoặc mô tả ảnh bằng model vision.",
      description: "Fallback local: chưa gọi model vision thật.",
      confidence: 0.35
    };
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
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: imageDataUrl, detail: "high" }
          ]
        }
      ],
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
  const result = await generateStructuredResponse(prompt, "Tutor");

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
  generateVisionStructuredResponse,
  getMockStructuredResponse,
  parseJsonOutput
};
