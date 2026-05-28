require("dotenv").config();
const { GoogleGenAI } = require("@google/genai"); // YENİ SDK
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
  
  // Google'ın en yeni, hızlı ve kısıtlamasız modeli
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  return {
    provider: "google",
    apiKey,
    model,
  };
}

async function askGemini(config, question) {
  // Yeni GoogleGenAI kütüphanesi başlatılıyor
  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  
  // Yeni SDK'nın oluşturma formatı
  const response = await ai.models.generateContent({
    model: config.model,
    contents: question,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2, // Halüsinasyonu önlemek için düşük değer
    }
  });

  return response.text.trim();
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