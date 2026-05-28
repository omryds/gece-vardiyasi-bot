require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("buraya_")) {
    throw new Error(
      "GEMINI_API_KEY eksik. Lütfen Render panelindeki Environment Variables bölümüne ekleyin."
    );
  }
  
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  return {
    provider: "google",
    apiKey,
    model,
  };
}

async function askGemini(config, question) {
  const genAI = new GoogleGenerativeAI(config.apiKey);
  const model = genAI.getGenerativeModel({ 
    model: config.model,
    systemInstruction: SYSTEM_PROMPT 
  });

  const result = await model.generateContent(question);
  return result.response.text().trim();
}

async function generateAnswer(question) {
  const config = getConfig();
  return askGemini(config, question);
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