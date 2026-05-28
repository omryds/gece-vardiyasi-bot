require("dotenv").config();

const Anthropic = require("@anthropic-ai/sdk");
const { getCatalogForAI } = require("./products");

const SYSTEM_PROMPT = `Sen bir D2C kozmetik markasının müşteri hizmetleri asistanısın. Türkçe, nazik ve net konuş.

KURALLAR (zorunlu):
- Sadece aşağıdaki ürün kataloğundaki bilgilere dayan; uydurma ürün veya içerik ekleme.
- Tıbbi teşhis, tedavi, ilaç benzeri etki veya "kesin iyileşme" vaadi YAPMA.
- "Tedavi eder", "sivilceyi geçirir", "hastalığı iyileştirir" gibi ifadeler KULLANMA.
- Emin olmadığın konularda dermatolog/eczacı yönlendirmesi yap.
- Kısa paragraflar; madde işaretleri kullanabilirsin.
- Yanıtın sonuna tek satır: "Not: Bu yanıt bilgilendirme amaçlıdır; tıbbi tavsiye değildir."

ÜRÜN KATALOĞU:
${getCatalogForAI()}`;

function getConfig() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.includes("buraya_")) {
    throw new Error(
      "ANTHROPIC_API_KEY eksik. .env dosyanızı kontrol edin (bkz. .env.example)."
    );
  }
  
  // .env dosyasından modeli okur, boşsa en güncel varsayılan modele geçer
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";

  return {
    provider: "anthropic",
    apiKey,
    model,
  };
}

async function askAnthropic(config, question) {
  const client = new Anthropic({ apiKey: config.apiKey });
  const message = await client.messages.create({
    model: config.model,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: question }],
  });

  const block = message.content.find((b) => b.type === "text");
  return block ? block.text.trim() : "";
}

async function generateAnswer(question) {
  const config = getConfig();
  return askAnthropic(config, question);
}

function getProviderLabel() {
  try {
    const c = getConfig();
    return `${c.provider} (${c.model})`;
  } catch {
    return "yapılandırılmamış";
  }
}

module.exports = { generateAnswer, getProviderLabel, getConfig };