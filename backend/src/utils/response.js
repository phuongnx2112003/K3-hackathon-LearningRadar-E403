function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Length": Buffer.byteLength(body)
  });

  res.end(body);
}

function sendOk(res, data, statusCode = 200) {
  sendJson(res, statusCode, { ok: true, data });
}

function sendError(res, statusCode, code, message) {
  sendJson(res, statusCode, {
    ok: false,
    error: { code, message }
  });
}

function sendOptions(res) {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end();
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function readMultipartPdf(req, maxBytes = 25 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers["content-type"] || "";
    const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;\s]+))/i);
    if (!boundaryMatch) return reject(new Error("multipart/form-data boundary is required"));

    const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(Object.assign(new Error("PDF must be 25MB or smaller"), { code: "PAYLOAD_TOO_LARGE" }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("error", reject);
    req.on("end", () => {
      try {
        const body = Buffer.concat(chunks);
        const fields = {};
        let file = null;
        let cursor = body.indexOf(boundary);
        while (cursor !== -1) {
          const partStart = cursor + boundary.length + 2;
          const next = body.indexOf(boundary, partStart);
          if (next === -1) break;
          const part = body.subarray(partStart, next - 2);
          const separator = part.indexOf(Buffer.from("\r\n\r\n"));
          if (separator !== -1) {
            const headers = part.subarray(0, separator).toString("utf8");
            const value = part.subarray(separator + 4);
            const name = headers.match(/name="([^"]+)"/i)?.[1];
            const filename = headers.match(/filename="([^"]*)"/i)?.[1];
            if (name && filename) file = { fieldName: name, filename, contentType: headers.match(/Content-Type:\s*([^\r\n]+)/i)?.[1] || "", buffer: value };
            else if (name) fields[name] = value.toString("utf8");
          }
          cursor = next;
        }
        resolve({ fields, file });
      } catch (error) { reject(error); }
    });
  });
}

module.exports = {
  readJson,
  readMultipartPdf,
  sendError,
  sendJson,
  sendOk,
  sendOptions
};
