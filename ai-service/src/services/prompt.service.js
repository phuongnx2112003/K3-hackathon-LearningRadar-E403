function buildContext(payload, fields) {
  return JSON.stringify(
    Object.fromEntries(fields.map((field) => [field, payload[field] || ""])),
    null,
    2
  );
}

function buildTutorPrompt(payload = {}) {
  return [
    "You are the VLearn AI Tutor. Answer in Vietnamese.",
    "Only explain based on the provided selectedText and question. Do not invent facts outside the context.",
    "`citation` is attached by the service, so do not include citation in this JSON.",
    "Return ONLY one valid JSON object matching this schema:",
    '{"answer":"string", "confidence":0.0}',
    "confidence must be a number from 0 to 1.",
    "Context data:",
    buildContext(payload, ["lessonId", "selectedText", "question"])
  ].join("\n");
}

function buildQuizPrompt(payload = {}) {
  return [
    "You create a Vietnamese 5-question multiple-choice quiz for VLearn.",
    "The quiz MUST test whether the student understood the exact selectedText and the exact question they just asked.",
    "Do not drift to another topic. If selectedText is about LLM, ask about LLM. If it is about Automation/Augmentation, ask about Automation/Augmentation.",
    "Create exactly 5 questions. Each question has exactly 4 options. Only one option is correct. correctIndex is an integer from 0 to 3.",
    "Questions must be clear, practical, and based only on the provided context.",
    "Avoid generic course-policy questions unless the selectedText itself is about course policy.",
    "Return ONLY one valid JSON object matching this schema:",
    '{"conceptId":"string", "conceptLabel":"string", "questions":[{"id":"q1", "question":"string", "options":["A","B","C","D"], "correctIndex":0}]}',
    "Context data:",
    buildContext(payload, ["lessonId", "conceptId", "conceptLabel", "selectedText", "question", "answer"])
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
  buildQuizPrompt,
  buildTutorPrompt
};
