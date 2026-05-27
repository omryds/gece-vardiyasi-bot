const { applyRegexGuillotine } = require("./healthClaims");
const { generateAnswer } = require("./ai");

/**
 * Tek bir sohbet mesajını işler (Regex Giyotini + Claude).
 * @param {string} message
 * @returns {Promise<{ ok: boolean, reply: string, blocked: boolean, blockSource?: string }>}
 */
async function processChatMessage(message) {
  const trimmed = (message || "").trim();

  if (!trimmed) {
    return {
      ok: false,
      blocked: false,
      reply: "",
      error: "Mesaj boş olamaz.",
      statusCode: 400,
    };
  }

  const inputGate = applyRegexGuillotine(trimmed, { source: "user" });
  if (inputGate.blocked) {
    return {
      ok: true,
      blocked: true,
      blockSource: "user",
      reply: inputGate.message,
      statusCode: 200,
    };
  }

  const rawAnswer = await generateAnswer(trimmed);

  if (!rawAnswer) {
    return {
      ok: false,
      blocked: false,
      reply: "",
      error: "Yapay zekadan boş yanıt geldi.",
      statusCode: 502,
    };
  }

  const outputGate = applyRegexGuillotine(rawAnswer, { source: "ai" });
  if (outputGate.blocked) {
    return {
      ok: true,
      blocked: true,
      blockSource: "ai",
      reply: outputGate.message,
      statusCode: 200,
    };
  }

  return {
    ok: true,
    blocked: false,
    reply: rawAnswer,
    statusCode: 200,
  };
}

module.exports = { processChatMessage };
