const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const casesPath = path.join(__dirname, "test-cases.json");
const resultsJsonPath = path.join(__dirname, "results.json");
const resultsMdPath = path.join(__dirname, "results.md");

const AI_PORT = "4300";
const BACKEND_PORT = "3300";
const AI_URL = `http://localhost:${AI_PORT}`;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function containsAll(answer, phrases) {
  const normalizedAnswer = normalize(answer);
  return phrases.every((phrase) => normalizedAnswer.includes(normalize(phrase)));
}

function containsAny(answer, phrases) {
  const normalizedAnswer = normalize(answer);
  return phrases.some((phrase) => normalizedAnswer.includes(normalize(phrase)));
}

async function postJson(url, payload, timeoutMs = 45000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: controller.signal
  });

  clearTimeout(timeout);

  const json = await response.json();

  if (!response.ok || !json.ok) {
    throw new Error(json.error?.message || `Request failed with ${response.status}`);
  }

  return json.data;
}

function startService(name, cwd, env) {
  const child = spawn(process.execPath, ["src/server.js"], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true
  });

  child.stdout.on("data", (data) => {
    process.stdout.write(`[${name}] ${data}`);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(`[${name}] ${data}`);
  });

  return child;
}

async function waitForHealth(url, label) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`${url}/health`);
      const json = await response.json();
      if (json.ok) return;
    } catch (error) {
      // wait and retry
    }

    await sleep(500);
  }

  throw new Error(`${label} did not become healthy`);
}

function gradeCase(testCase, data) {
  const answer = data.answer || "";
  const hasRequired = containsAll(answer, testCase.mustContain || []);
  const hasForbidden = containsAny(answer, testCase.mustNotContain || []);
  const noFallback = data.fallback !== true;

  return {
    passed: hasRequired && !hasForbidden && noFallback,
    hasRequired,
    hasForbidden,
    noFallback
  };
}

function toMarkdown(results) {
  const passed = results.filter((result) => result.passed).length;
  const total = results.length;

  const lines = [
    "# LearningRadar Eval Results",
    "",
    `Ket qua lan chay dau: **${passed}/${total}**`,
    "",
    "| ID | Type | Source | Pass | Fallback | Expected check | Answer summary |",
    "|---|---|---|---|---|---|---|"
  ];

  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    const fallback = result.fallback ? "true" : "false";
    const expected = [
      result.hasRequired ? "co tu khoa bat buoc" : "thieu tu khoa bat buoc",
      result.hasForbidden ? "co tu cam" : "khong co tu cam"
    ].join("; ");
    const answer = String(result.answer || "")
      .replace(/\|/g, "/")
      .replace(/\s+/g, " ")
      .slice(0, 220);

    lines.push(
      `| ${result.id} | ${result.type} | ${result.source} | ${status} | ${fallback} | ${expected} | ${answer} |`
    );
  }

  lines.push("");
  lines.push("## Ghi chu");
  lines.push("");
  lines.push("- PASS/FAIL duoc cham theo `mustContain` va `mustNotContain` trong `eval/test-cases.json`.");
  lines.push("- `fallback=false` nghia la backend nhan cau tra loi tu AI service/model that, khong phai fallback backend.");
  lines.push("- Cac cau FAIL van duoc giu lai de nhom phan tich va cai tien prompt/guardrail.");

  return lines.join("\n");
}

async function main() {
  const testCases = JSON.parse(fs.readFileSync(casesPath, "utf8"));
  const ai = startService("ai-service", path.join(root, "ai-service"), { PORT: AI_PORT });
  const backend = startService("backend", path.join(root, "backend"), {
    PORT: BACKEND_PORT,
    AI_SERVICE_URL: AI_URL
  });

  try {
    await waitForHealth(AI_URL, "AI service");
    await waitForHealth(BACKEND_URL, "Backend");

    const results = [];

    for (const testCase of testCases) {
      try {
        const data = await postJson(`${BACKEND_URL}/api/tutor/ask`, {
          lessonId: "lesson-01",
          studentId: "eval-runner",
          selectedText: testCase.selectedText,
          question: testCase.question
        });

        const grade = gradeCase(testCase, data);
        results.push({
          id: testCase.id,
          type: testCase.type,
          source: testCase.source,
          question: testCase.question,
          selectedText: testCase.selectedText,
          answer: data.answer,
          conceptLabel: data.conceptLabel,
          fallback: data.fallback === true,
          error: "",
          ...grade
        });

        console.log(`${testCase.id}: ${grade.passed ? "PASS" : "FAIL"}`);
      } catch (error) {
        results.push({
          id: testCase.id,
          type: testCase.type,
          source: testCase.source,
          question: testCase.question,
          selectedText: testCase.selectedText,
          answer: "",
          conceptLabel: "",
          fallback: false,
          error: error.name === "AbortError" ? "timeout" : error.message,
          passed: false,
          hasRequired: false,
          hasForbidden: false,
          noFallback: true
        });
        console.log(`${testCase.id}: FAIL (${error.name === "AbortError" ? "timeout" : error.message})`);
      }

      fs.writeFileSync(resultsJsonPath, JSON.stringify(results, null, 2), "utf8");
      fs.writeFileSync(resultsMdPath, toMarkdown(results), "utf8");
    }

    fs.writeFileSync(resultsJsonPath, JSON.stringify(results, null, 2), "utf8");
    fs.writeFileSync(resultsMdPath, toMarkdown(results), "utf8");

    const passed = results.filter((result) => result.passed).length;
    console.log(`RESULT ${passed}/${results.length}`);
  } finally {
    backend.kill();
    ai.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
