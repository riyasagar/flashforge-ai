const express  = require('express')
const multer   = require('multer')
const pdfParse = require('pdf-parse')
const fetch    = require('node-fetch')

const router = express.Router()

/* ─── Upload Config ─────────────────────────────────── */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter (_req, file, cb) {
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('PDF files only'))
  }
})

/* ─── Helpers ───────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Smart default: based on word count if user doesn't specify
function smartCardCount(words) {
  if (words < 300)  return 8
  if (words < 1000) return 15
  if (words < 3000) return 20
  return 25
}

function cleanText(raw) {
  return raw
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E]/g, ' ')
    .trim()
    .substring(0, 4000)
}

function buildPrompt(text, title, count, difficulty) {
  const diffLine = difficulty && difficulty !== 'mixed'
    ? `- All cards must be difficulty: ${difficulty}`
    : '- Mix of easy, medium, and hard difficulty'

  return `You are an expert teacher and flashcard creator. Generate exactly ${count} high-quality flashcards from the study material below.

${title ? `Topic: ${title}\n` : ''}MATERIAL:
${text}

STRICT RULES:
- Cover ALL key concepts, definitions, relationships, formulas, and examples from the material
- question: specific and testable — not vague or yes/no
- answer: DETAILED explanation of 2-4 sentences. Do NOT give one-liners. Explain WHY, HOW, or give context.
- hint: a useful clue that helps recall without giving away the answer
- tags: 1-3 relevant keywords
- ${diffLine}
- difficulty must be exactly one of: "easy", "medium", "hard"
- Spread cards evenly across the whole material, not just the beginning
- Return ONLY a raw JSON array, zero markdown, zero explanation

FORMAT (follow exactly):
[
  {
    "question": "...",
    "answer": "...",
    "hint": "...",
    "tags": ["..."],
    "difficulty": "easy"
  }
]`
}

function parseCards(raw) {
  if (!raw) return null
  let s = raw.replace(/```json/gi, '').replace(/```/g, '').trim()
  try { return JSON.parse(s) } catch {}
  const start = s.indexOf('['), end = s.lastIndexOf(']')
  if (start !== -1 && end > start) {
    try { return JSON.parse(s.slice(start, end + 1)) } catch {}
  }
  return null
}

/* ─── Groq API Call ─────────────────────────────────── */
// Free tier: 14,400 requests/day — effectively unlimited
const GROQ_MODELS = [
  'llama-3.3-70b-versatile',   // best quality, use first
  'llama-3.1-8b-instant',      // fast fallback
  'llama3-8b-8192',             // last resort
]

async function callGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set in .env')

  for (const model of GROQ_MODELS) {
    console.log(`[groq] trying model=${model}`)

    let res
    try {
      res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert educator. You create detailed, accurate flashcards. You always return only valid JSON arrays with no extra text.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.6,
          max_tokens: 4096,
        })
      })
    } catch (networkErr) {
      throw new Error('Network error reaching Groq: ' + networkErr.message)
    }

    if (res.ok) {
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content || ''
      if (text) {
        console.log(`[groq] ✅ success with ${model}`)
        return text
      }
      throw new Error('Empty response from Groq')
    }

    if (res.status === 429) {
      console.warn(`[groq] ${model} rate limited, trying next model in 3s...`)
      await sleep(3000)
      continue
    }

    if (res.status === 401) {
      throw new Error('Invalid GROQ_API_KEY. Check your .env file.')
    }

    const body = await res.text()
    console.warn(`[groq] ${model} error ${res.status}: ${body.slice(0, 150)}`)
    // try next model
  }

  throw new Error('All Groq models failed. Check your API key or try again.')
}

/* ─── Lock ───────────────────────────────────────────── */
let isGenerating = false

/* ─── Route ─────────────────────────────────────────── */
router.post('/', upload.single('pdf'), async (req, res) => {

  if (isGenerating) {
    return res.status(429).json({ error: 'Already generating flashcards. Please wait.' })
  }

  isGenerating = true

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF uploaded' })
    }

    const title = (req.body.deckTitle || '').trim()

    // User-specified card count (10–50), or 0 = auto
    const requestedCount = parseInt(req.body.cardCount || '0', 10)
    const difficulty     = (req.body.difficulty || 'mixed').trim()

    // Validate difficulty
    const validDifficulties = ['easy', 'medium', 'hard', 'mixed']
    const finalDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'mixed'

    /* ── Parse PDF ── */
    let parsed
    try {
      parsed = await pdfParse(req.file.buffer)
    } catch {
      return res.status(422).json({
        error: 'Could not read this PDF. Make sure it is a text-based PDF, not a scanned image.'
      })
    }

    const rawText = (parsed.text || '').trim()
    if (rawText.length < 50) {
      return res.status(422).json({
        error: 'PDF has no readable text. Scanned or image-only PDFs are not supported.'
      })
    }

    const text  = cleanText(rawText)
    const words = text.split(/\s+/).length

    // Determine final card count
    let count
    if (requestedCount >= 5 && requestedCount <= 50) {
      count = requestedCount
    } else {
      count = smartCardCount(words)
    }

    console.log(`[generate] ${words} words, requested=${requestedCount}, final count=${count}, difficulty=${finalDifficulty}`)

    const prompt = buildPrompt(text, title, count, finalDifficulty)

    /* ── Call Groq ── */
    let raw
    try {
      raw = await callGroq(prompt)
    } catch (e) {
      console.error('[groq] error:', e.message)
      return res.status(503).json({ error: e.message })
    }

    /* ── Parse cards ── */
    const cards = parseCards(raw)
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      console.error('[parse] raw response:', raw.slice(0, 400))
      return res.status(500).json({ error: 'Could not parse flashcards from AI response.' })
    }

    // Validate each card has required fields
    const validCards = cards.filter(c =>
      c &&
      typeof c.question === 'string' && c.question.trim().length > 5 &&
      typeof c.answer   === 'string' && c.answer.trim().length   > 10
    )

    if (validCards.length === 0) {
      return res.status(500).json({ error: 'AI returned cards in wrong format.' })
    }

    console.log(`✅ ${validCards.length} cards generated`)

    res.json({
      cards: validCards,
      meta: {
        pages:      parsed.numpages,
        words,
        count:      validCards.length,
        difficulty: finalDifficulty,
        model:      'groq/llama-3.3-70b-versatile'
      }
    })

  } catch (err) {
    console.error('[route] unhandled error:', err)
    res.status(500).json({ error: 'Server error: ' + err.message })
  } finally {
    isGenerating = false
  }
})

module.exports = router