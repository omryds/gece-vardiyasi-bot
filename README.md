# Gece Vardiyası Bot (REST API + Claude)

Kozmetik müşteri hizmetleri botu. **Express** ile `POST /api/chat` sunar; cevaplar **Anthropic Claude** ile üretilir. **Regex Giyotini** hem gelen mesajda hem AI cevabında çalışır.

## Kurulum

```bash
cd ~/Desktop/GeceVardiyasi_Bot
npm install
cp .env.example .env
# .env içine ANTHROPIC_API_KEY yazın
npm start
```

Sunucu varsayılan olarak **http://localhost:3000** adresinde çalışır.

## API

### `GET /health`

Sunucu ve yapılandırma kontrolü.

### `POST /api/chat`

**Gövde (JSON):**

```json
{ "message": "Gece Nemlendirici Krem sivilce yapar mı?" }
```

(`question` veya `text` alanı da kabul edilir.)

**Başarılı yanıt:**

```json
{
  "ok": true,
  "reply": "...",
  "blocked": false,
  "blockSource": null
}
```

**Regex Giyotini engeli:**

```json
{
  "ok": true,
  "reply": "Üzgünüm, bu soru...",
  "blocked": true,
  "blockSource": "user"
}
```

### Örnek curl

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Gece Nemlendirici Krem sivilce yapar mı?"}'
```

## Shopify CORS

Canlı mağazada tarayıcıdan istek atacaksanız `.env` içine mağaza kökeninizi ekleyin:

```env
CORS_ORIGIN=https://magazaniz.myshopify.com
```

Boş bırakırsanız geliştirme için tüm kökenlere izin verilir.

## Güvenlik

- `.env` dosyasını GitHub'a yüklemeyin.
- API anahtarınızı paylaşmayın.
