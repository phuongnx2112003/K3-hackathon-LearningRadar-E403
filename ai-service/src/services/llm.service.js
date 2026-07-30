const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_LLM_TIMEOUT_MS = 30000;
// Leave enough headroom for an adaptive, detailed explanation and its citation
// markers. The prompt asks the model to stop when the concept is fully clear,
// instead of forcing every answer to have a fixed number of words.
const DEFAULT_MAX_OUTPUT_TOKENS = 2400;
const { mockAiAnswer, mockQuiz } = require("../data/mock-ai-responses");

async function fetchWithTimeout(url, options, timeoutMs = Number(process.env.LLM_TIMEOUT_MS) || DEFAULT_LLM_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") throw new Error(`LLM request timed out after ${timeoutMs}ms`);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

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
    conceptId: mockAiAnswer.conceptId,
    conceptLabel: mockAiAnswer.conceptLabel,
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
  const chatText = response.choices?.[0]?.message?.content;
  if (typeof chatText === "string" && chatText.trim()) {
    return chatText;
  }

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

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    // Some OpenAI-compatible endpoints stop at max_tokens without returning a
    // useful finish reason. If the response is otherwise a JSON object, close
    // only the unfinished string/object so the student still gets the answer.
    const start = jsonText.indexOf("{");
    if (start < 0) throw error;
    const candidate = jsonText.slice(start).replace(/,\s*$/, "");
    let inString = false;
    let escaped = false;
    let depth = 0;
    for (const character of candidate) {
      if (escaped) { escaped = false; continue; }
      if (character === "\\" && inString) { escaped = true; continue; }
      if (character === '"') { inString = !inString; continue; }
      if (!inString && character === "{") depth += 1;
      if (!inString && character === "}") depth -= 1;
    }
    const repaired = `${candidate}${inString ? '"' : ''}${"}".repeat(Math.max(depth, 0))}`;
    try {
      return JSON.parse(repaired);
    } catch {
      throw error;
    }
  }
}

async function generateStructuredResponse(prompt, schemaName) {
  if (!shouldUseOpenAi()) {
    return getMockStructuredResponse(schemaName);
  }

  if (typeof fetch !== "function") {
    throw new Error("Global fetch is not available. Use Node 18 or newer.");
  }

  const { apiKey, baseUrl, model } = getOpenAiConfig();
  // Ollama Cloud's OpenAI-compatible chat endpoint is substantially more
  // reliable for structured, context-heavy prompts than its Responses endpoint.
  const useChatCompletions = String(process.env.OPENAI_API_STYLE || "").toLowerCase() === "chat"
    || /ollama/i.test(baseUrl);
  const endpoint = useChatCompletions ? `${baseUrl}/chat/completions` : `${baseUrl}/responses`;
  const body = useChatCompletions
    ? {
        model,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        max_tokens: Number(process.env.MAX_LLM_OUTPUT_TOKENS) || DEFAULT_MAX_OUTPUT_TOKENS,
        response_format: { type: "json_object" }
      }
    : {
        model,
        input: prompt,
        store: false,
        max_output_tokens: Number(process.env.MAX_LLM_OUTPUT_TOKENS) || DEFAULT_MAX_OUTPUT_TOKENS,
        text: { format: { type: "json_object" } }
      };
  const response = await fetchWithTimeout(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
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
  const response = await fetchWithTimeout(`${baseUrl}/responses`, {
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
      max_output_tokens: Number(process.env.MAX_LLM_OUTPUT_TOKENS) || DEFAULT_MAX_OUTPUT_TOKENS,
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

  if (
    typeof result.answer !== "string" ||
    typeof result.conceptId !== "string" ||
    typeof result.conceptLabel !== "string" ||
    !Number.isFinite(result.confidence)
  ) {
    throw new Error("Tutor response must contain answer, conceptId, conceptLabel, and confidence");
  }

  return {
    answer: result.answer,
    conceptId: result.conceptId,
    conceptLabel: result.conceptLabel,
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
