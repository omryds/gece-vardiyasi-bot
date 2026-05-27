const fs = require("fs");
const path = require("path");

const productsPath = path.join(__dirname, "..", "data", "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

function listProducts() {
  return products.map((p) => p.name);
}

/** Yapay zeka sistem mesajına eklenecek ürün kataloğu metni */
function getCatalogForAI() {
  return products
    .map((p) => {
      const faqLines = Object.entries(p.faq || {})
        .map(([topic, answer]) => `    - ${topic}: ${answer}`)
        .join("\n");
      return [
        `• ${p.name} (id: ${p.id})`,
        `  Anahtar kelimeler: ${(p.keywords || []).join(", ")}`,
        `  İçerikler: ${(p.ingredients || []).join(", ")}`,
        faqLines ? `  Bilinen SSS notları:\n${faqLines}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

module.exports = { listProducts, getCatalogForAI, products };
