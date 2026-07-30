function buildContext(payload, fields) {
  return JSON.stringify(
    Object.fromEntries(fields.map((field) => [field, payload[field] || ""])),
    null,
    2
  );
}

function buildTutorPrompt(payload = {}) {
  const citationSources = (payload.relevantChunks || []).map((chunk, index) => ({
    number: index + 1,
    page: chunk.metadata?.page || "?",
    source: chunk.metadata?.filename || chunk.metadata?.title || "Tài liệu học tập",
    // A compact excerpt is enough for grounded explanation and keeps cloud
    // models responsive when two RAG chunks are returned.
    text: String(chunk.text || "").slice(0, 700)
  }));
  return [
    "You are a patient, encouraging Vietnamese teacher for VLearn students.",
    "Answer the student's actual question first, then teach the idea clearly enough for a beginner to understand.",
    "Only explain based on the provided selectedText, retrieved course material, and question. Do not invent facts outside the context. If the material is insufficient, say exactly what is missing instead of guessing.",
    "When the student selected multiple passages, explicitly explain how the passages relate to each other.",
    "Use plain Vietnamese. Define technical terms on first use, break difficult reasoning into small steps, and use one short practical analogy or example only when it helps understanding and is consistent with the material.",
    "Explain in Vietnamese as briefly or as fully as needed for this specific student to understand the concept. Do not target a fixed word count and do not pad the answer. Use short paragraphs, bullets, definitions, comparisons, examples, or step-by-step reasoning whenever they make the explanation clearer. Stop only when the key idea, important terms, relationships, and practical implications are adequately covered.",
    "Do not repeat the raw selected text, do not mention embeddings/RAG, and do not fabricate page numbers or sources.",
    "Cite every factual teaching point using the matching [1], [2], ... marker immediately after the sentence or bullet. Only use citation numbers listed in Citation sources. If a claim is not supported by a source, say that the material is insufficient instead of citing it.",
    "Also identify the student's specific learning gap: conceptLabel must be Vietnamese, specific, and no more than 10 words; conceptId must use lowercase letters, numbers, and hyphens.",
    "Return ONLY one valid JSON object matching this schema:",
    '{"answer":"string", "conceptId":"string", "conceptLabel":"string", "confidence":0.0}',
    "confidence must be a number from 0 to 1.",
    "Context data:",
    buildContext({ ...payload, citationSources }, ["lessonId", "selectedText", "question", "citationSources"])
  ].join("\n");
}

function buildQuizPrompt(payload = {}) {
  return [
    "You create a Vietnamese 5-question multiple-choice quiz for VLearn.",
    "The quiz MUST test whether the student understood the exact selectedText and the exact question they just asked.",
    "Do not drift to another topic. If selectedText is about LLM, ask about LLM. If it is about Automation/Augmentation, ask about Automation/Augmentation.",
    "Create exactly 5 questions. Each question has exactly 4 options. Only one option is correct. correctIndex is an integer from 0 to 3.",
    "Each question must include explanation: a short Vietnamese explanation of why the correct option is correct.",
    "Questions must be clear, practical, and based only on the provided context.",
    "Avoid generic course-policy questions unless the selectedText itself is about course policy.",
    "Return ONLY one valid JSON object matching this schema:",
    '{"conceptId":"string", "conceptLabel":"string", "questions":[{"id":"q1", "question":"string", "options":["A","B","C","D"], "correctIndex":0, "explanation":"string"}]}',
    "Context data:",
    buildContext(payload, ["lessonId", "conceptId", "conceptLabel", "selectedText", "question", "answer"])
  ].join("\n");
}

function buildQuizReviewPrompt(payload = {}) {
  return [
    "You are the VLearn AI Tutor reviewing a submitted quiz. Answer in Vietnamese.",
    "Generate a specific explanation for each reviewed question, based only on the selectedText, original student question, tutor answer, quiz question, the student's selected option, and the correct option.",
    "Do not use generic wording like 'xem lai doan kien thuc'. Explain the exact misconception and why the correct option is better.",
    "For correct answers, briefly reinforce the key idea. For wrong answers, explain why the chosen answer is wrong and why the correct answer is right.",
    "Keep each explanation 2-3 concise sentences.",
    "Return ONLY one valid JSON object matching this schema:",
    '{"review":[{"questionId":"q1", "explanation":"string"}]}',
    "Context data:",
    JSON.stringify(payload, null, 2)
  ].join("\n");
}

function buildSlideRegionVisionPrompt(payload = {}) {
  return [
    "You are VLearn slide-region OCR and image understanding.",
    "The user circled one region of a PDF slide. Analyze ONLY that image region.",
    "If the region is mostly text or a scanned image of text, OCR it exactly as much as possible.",
    "If the region is a diagram/chart/table/image, summarize the diagram in Vietnamese: visible nodes, labels, arrows/relationships, and the main idea. Do not only list raw labels.",
    "If textHint is provided, use it only as an OCR hint; still inspect the image and describe the visual structure.",
    "Do not invent content outside the image. If unclear, say what is unclear.",
    "Return ONLY one valid JSON object matching this schema:",
    '{"selectedText":"string", "description":"string", "regionType":"text|diagram|mixed|unclear", "confidence":0.0}',
    "Metadata:",
    buildContext(payload, ["slideFile", "page", "textHint"])
  ].join("\n");
}

function buildLabelPrompt(payload = {}) {
  return [
    "You label the student's learning gap for VLearn. Answer in Vietnamese.",
    "The label must be specific, at most 10 words, and describe the real knowledge gap.",
    "conceptId must use lowercase letters, numbers, and hyphens. confidence must be a number from 0 to 1.",
    "Return ONLY one valid JSON object matching this schema:",
    '{"conceptId":"string", "conceptLabel":"string", "confidence":0.0}',
    "Context data:",
    buildContext(payload, ["lessonId", "selectedText", "question"])
  ].join("\n");
}

module.exports = {
  buildContext,
  buildLabelPrompt,
  buildQuizReviewPrompt,
  buildQuizPrompt,
  buildSlideRegionVisionPrompt,
  buildTutorPrompt
};
