import { useState, useCallback } from "react";

// Moboost AI Bridge - connects search queries to OpenClaw
// The API endpoint is configurable: defaults to the relay running on the same host
// Same-origin when served from relay; override with VITE_MOBOOST_API if needed
const API_BASE = import.meta.env.VITE_MOBOOST_API || "";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export function useMoboostAI() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const userMsg: AIMessage = { role: "user", content: query, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const assistantMsg: AIMessage = {
        role: "assistant",
        content: data.reply || data.message || "No response",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errMsg = err?.message || "Connection failed";
      setError(errMsg);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `⚠️ ${errMsg}`, timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendQuery, clearMessages };
}
