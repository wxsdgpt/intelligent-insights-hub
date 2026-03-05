#!/usr/bin/env node
/**
 * Moboost AI Relay — lightweight HTTP bridge between the web UI and OpenClaw.
 *
 * POST /api/chat  { message: "..." }  →  forwards to OpenClaw Gateway  →  { reply: "..." }
 *
 * Runs on 0.0.0.0:3456 so both local and LAN clients can reach it.
 * Set OPENCLAW_GW_URL to override the gateway WebSocket address.
 * Set RELAY_PORT to change the listening port.
 */

const http = require("http");
const { execSync } = require("child_process");

const PORT = process.env.RELAY_PORT || 3456;
const OPENCLAW_GW = process.env.OPENCLAW_GW_URL || "ws://127.0.0.1:18789";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function sendToOpenClaw(message) {
  // Use openclaw CLI to send a system event to the main agent
  // This goes through the gateway and arrives as a user message
  try {
    const escaped = message.replace(/'/g, "'\\''");
    const cmd = `openclaw send --message '${escaped}' --timeout 120 2>&1`;
    const result = execSync(cmd, {
      timeout: 130000,
      encoding: "utf-8",
      env: { ...process.env, PATH: process.env.PATH },
    });
    return result.trim();
  } catch (err) {
    console.error("[relay] openclaw send failed:", err.message);
    return `Error: ${err.message}`;
  }
}

const server = http.createServer((req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({ status: "ok", gateway: OPENCLAW_GW }));
    return;
  }

  // Chat endpoint
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { message } = JSON.parse(body);
        if (!message) {
          res.writeHead(400, corsHeaders);
          res.end(JSON.stringify({ error: "message is required" }));
          return;
        }

        console.log(`[relay] → ${message.substring(0, 80)}...`);
        const reply = sendToOpenClaw(message);
        console.log(`[relay] ← ${reply.substring(0, 80)}...`);

        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({ reply }));
      } catch (err) {
        res.writeHead(500, corsHeaders);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[relay] Moboost AI Relay listening on http://0.0.0.0:${PORT}`);
  console.log(`[relay] OpenClaw Gateway: ${OPENCLAW_GW}`);
});
