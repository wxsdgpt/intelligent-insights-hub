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
const { execSync } = require("child_process");

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

function sendToOpenClaw(message) {
  try {
    const escaped = message.replace(/'/g, "'\\''");
    const cmd = `openclaw agent --message '${escaped}' --json --timeout 120 2>&1`;
    const result = execSync(cmd, {
      timeout: 130000,
      encoding: "utf-8",
      env: { ...process.env },
    });
    // Parse JSON output to extract the reply
    try {
      const data = JSON.parse(result.trim());
      return data.reply || data.message || data.content || result.trim();
    } catch {
      // If not JSON, return raw output (strip ANSI codes)
      return result.trim().replace(/\x1b\[[0-9;]*m/g, "");
    }
  } catch (err) {
    console.error("[relay] openclaw agent error:", err.message);
    // Try to extract useful output from stderr
    const output = err.stdout || err.stderr || err.message;
    return `Error: ${typeof output === "string" ? output.substring(0, 500) : err.message}`;
  }
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
        const reply = sendToOpenClaw(message);
        console.log(`[relay] ← ${reply.substring(0, 100)}`);
        res.writeHead(200, { ...corsHeaders, "Content-Type": "application/json" });
        res.end(JSON.stringify({ reply }));
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
