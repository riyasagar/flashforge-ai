const express = require('express')
const fs      = require('fs')
const path    = require('path')
const router  = express.Router()

const FILE = path.join(__dirname, '..', 'data', 'decks.json')

function read () {
  try { return fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {} }
  catch { return {} }
}
function write (data) {
  const dir = path.dirname(FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

router.get('/:uid',         (req, res) => res.json({ decks: read()[req.params.uid] || [] }))
router.post('/:uid',        (req, res) => {
  const { decks } = req.body
  if (!Array.isArray(decks)) return res.status(400).json({ error: 'decks must be array' })
  const s = read(); s[req.params.uid] = decks; write(s)
  res.json({ ok: true })
})
router.delete('/:uid/:did', (req, res) => {
  const s = read()
  s[req.params.uid] = (s[req.params.uid] || []).filter(d => d.id !== req.params.did)
  write(s); res.json({ ok: true })
})

module.exports = router
