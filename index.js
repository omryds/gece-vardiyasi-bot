#!/usr/bin/env node
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { processChatMessage } = require("./src/chat");
const { getProviderLabel } = require("./src/ai");
const { listProducts } = require("./src/products");

const PORT = Number(process.env.PORT) || 3001;

const app = express();

// Shopify / web mağazası için CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS: Bu kaynağa izin verilmiyor."));
    },
  })
);

app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "gece-vardiyasi-bot",
    ai: getProviderLabel(),
    products: listProducts(),
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message =
      req.body?.message ?? req.body?.question ?? req.body?.text ?? "";

    const result = await processChatMessage(message);

    if (!result.ok) {
      return res.status(result.statusCode || 400).json({
        ok: false,
        error: result.error,
        reply: null,
        blocked: false,
      });
    }

    return res.status(result.statusCode || 200).json({
      ok: true,
      reply: result.reply,
      blocked: result.blocked,
      blockSource: result.blockSource || null,
    });
  } catch (err) {
    const msg = err.message || String(err);
    console.error("[POST /api/chat]", msg);
    return res.status(500).json({
      ok: false,
      error: msg,
      reply: null,
      blocked: false,
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: "Endpoint bulunamadı." });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   Gece Vardiyası — REST API (Shopify hazırlık)   ║
╚══════════════════════════════════════════════════╝

Sunucu:  http://localhost:${PORT}
Sağlık:  GET  /health
Sohbet:  POST /api/chat
Yapay zeka: ${getProviderLabel()}
Regex Giyotini: kullanıcı mesajı + AI cevabı (yanıt dönmeden önce)

Örnek istek:
  curl -X POST http://localhost:${PORT}/api/chat \\
    -H "Content-Type: application/json" \\
    -d '{"message":"Gece Nemlendirici Krem sivilce yapar mı?"}'
`);
});
