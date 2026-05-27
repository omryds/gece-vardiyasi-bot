/**
 * Regex Giyotini — sağlık / tıbbi etki iddiası tespiti (Türkçe).
 * Hem kullanıcı sorusunda hem yapay zeka cevabında çalışır.
 */
const HEALTH_CLAIM_PATTERNS = [
  /\btedavi\b/i,
  /\btedavi\s+eder/i,
  /\biyileştirir\b/i,
  /\biyileştiri(r|mek)\b/i,
  /\bşifa\b/i,
  /\bhastalık\b/i,
  /\beczane\b/i,
  /\bilaç\b/i,
  /\bilaç\s+gibi\b/i,
  /\bantibiyotik\b/i,
  /\bsteroid\b/i,
  /\bkanser\b/i,
  /\bteşhis\b/i,
  /\bteşhis\s+eder/i,
  /\bçare\b/i,
  /\bkesin\s+çözüm\b/i,
  /\b%100\s+(etkili|iyileşme)\b/i,
  /\bsivilceyi\s+(geçirir|yok\s+eder|bitirir)\b/i,
  /\bakneyi\s+(geçirir|yok\s+eder|bitirir)\b/i,
  /\beczanelik\b/i,
  /\bdoktor\s+onaylı\b/i,
  /\btıbbi\s+onay\b/i,
  /\brecete\b/i,
];

const REFUSAL_MESSAGE_USER =
  "Üzgünüm, bu soru tıbbi veya tedavi edici bir iddia içeriyor gibi görünüyor. " +
  "Yasal ve güvenlik kuralları gereği bu tür ifadelerle ilgili yanıt veremiyorum. " +
  "Cilt sağlığınız için bir dermatoloğa veya eczacınıza danışmanızı öneririm.";

const REFUSAL_MESSAGE_AI =
  "Üzgünüm, oluşturulan yanıt güvenlik filtremizden geçemedi (olası sağlık/tedavi iddiası). " +
  "Bu nedenle cevabı gösteremiyorum. Lütfen sorunuzu farklı kelimelerle sorun veya bir uzmana danışın.";

function containsHealthClaim(text) {
  const normalized = (text || "").trim();
  if (!normalized) return false;
  return HEALTH_CLAIM_PATTERNS.some((pattern) => pattern.test(normalized));
}

/**
 * Regex Giyotini: metni ekrana basmadan önce kontrol eder.
 * @returns {{ blocked: boolean, message?: string }}
 */
function applyRegexGuillotine(text, { source = "user" } = {}) {
  if (!containsHealthClaim(text)) {
    return { blocked: false };
  }
  const message =
    source === "ai" ? REFUSAL_MESSAGE_AI : REFUSAL_MESSAGE_USER;
  return { blocked: true, message };
}

module.exports = {
  containsHealthClaim,
  applyRegexGuillotine,
  REFUSAL_MESSAGE_USER,
  REFUSAL_MESSAGE_AI,
  // Geriye dönük uyumluluk
  REFUSAL_MESSAGE: REFUSAL_MESSAGE_USER,
};
