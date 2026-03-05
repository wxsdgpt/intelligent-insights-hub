#!/usr/bin/env node
/**
 * Moboost AI Relay — serves the built frontend + bridges chat to OpenClaw.
 *
 * GET  /              → serves dist/index.html (SPA)
 * GET  /assets/*      → serves static assets
 * POST /api/chat      → forwards to OpenClaw → returns reply
 * GET  /api/health    → health check
 *
 * Usage:
 *   cd intelligent-insights-hub
 *   npm run build && node relay/server.js
 *
 * Env:
 *   RELAY_PORT       (default 3456)
 *   OPENCLAW_GW_URL  (default ws://127.0.0.1:18789)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.RELAY_PORT || 3456;
const DIST = path.resolve(__dirname, "../dist");

// MIME types
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function serveStatic(req, res) {
  // Strip basename prefix for local serving (no /intelligent-insights-hub/ prefix needed)
  let urlPath = req.url.split("?")[0];

  // Remove the GitHub Pages basename prefix if present
  const prefix = "/intelligent-insights-hub";
  if (urlPath.startsWith(prefix)) {
    urlPath = urlPath.slice(prefix.length) || "/";
  }

  let filePath = path.join(DIST, urlPath);

  // If path is directory or doesn't exist, serve index.html (SPA fallback)
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, "index.html");
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || "application/octet-stream";

  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}

const GATEWAY_URL = process.env.OPENCLAW_GW_URL || "http://127.0.0.1:18789";
const GATEWAY_TOKEN = process.env.OPENCLAW_GW_TOKEN || "eca4234ac994110849496f8c92df8662832f612bd9eedd51";

function sendToOpenClaw(message) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: "openclaw:main",
      messages: [{ role: "user", content: message }],
      user: "moboost-web",
    });

    const url = new URL(`${GATEWAY_URL}/v1/chat/completions`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GATEWAY_TOKEN}`,
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try {
          const data = JSON.parse(body);
          const reply = data.choices?.[0]?.message?.content || body;
          resolve(reply);
        } catch {
          resolve(body);
        }
      });
    });

    req.on("error", (err) => {
      console.error("[relay] gateway request error:", err.message);
      resolve(`Error: ${err.message}`);
    });

    req.setTimeout(120000, () => {
      req.destroy();
      resolve("Error: request timeout (120s)");
    });

    req.write(postData);
    req.end();
  });
}

const server = http.createServer((req, res) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // API: health
  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", time: new Date().toISOString() }));
    return;
  }

  // API: chat
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      try {
        const { message } = JSON.parse(body);
        if (!message) {
          res.writeHead(400, { ...corsHeaders, "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "message is required" }));
          return;
        }
        console.log(`[relay] → ${message.substring(0, 100)}`);
        sendToOpenClaw(message).then((reply) => {
          console.log(`[relay] ← ${reply.substring(0, 100)}`);
          res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
          res.end(JSON.stringify({ reply }));
        });
      } catch (err) {
        res.writeHead(500, { ...corsHeaders, "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Everything else: serve static files (SPA)
  serveStatic(req, res);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n  🚀 Moboost AI running at http://localhost:${PORT}`);
  console.log(`  📂 Serving: ${DIST}`);
  console.log(`  🤖 OpenClaw relay active\n`);
});
