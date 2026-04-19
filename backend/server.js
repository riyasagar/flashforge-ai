require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')
const fs      = require('fs')

const generateRouter = require('./routes/generate')
const decksRouter    = require('./routes/decks')

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.use('/api/generate', generateRouter)
app.use('/api/decks',    decksRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, hasKey: !!process.env.GROQ_API_KEY })
})

// Serve frontend in production
const distPath = path.join(__dirname, '..', 'frontend', 'dist')

if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath))

  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`\n⚡ FlashForge running on http://localhost:${PORT}`)
  console.log(`   Groq key: ${process.env.GROQ_API_KEY ? '✅ set' : '❌ MISSING – add to backend/.env'}`)
  console.log(`   Frontend: ${fs.existsSync(distPath) ? '✅ built' : '⚠️ run: cd frontend && npm run build'}`)
})