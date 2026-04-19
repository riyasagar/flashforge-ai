export async function generateFromPDF (pdfFile, deckTitle) {
  const form = new FormData()
  form.append('pdf', pdfFile)
  form.append('deckTitle', deckTitle || '')
  const res  = await fetch('/api/generate', { method: 'POST', body: form })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Server error ${res.status}`)
  return data
}

export async function loadDecks (uid) {
  try { const r = await fetch(`/api/decks/${uid}`); const d = await r.json(); return Array.isArray(d.decks) ? d.decks : [] }
  catch { return [] }
}

export async function saveDecks (uid, decks) {
  try { await fetch(`/api/decks/${uid}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ decks }) }) }
  catch { /* localStorage fallback */ }
}

export async function deleteDeck (uid, did) {
  try { await fetch(`/api/decks/${uid}/${did}`, { method:'DELETE' }) }
  catch { /* ignore */ }
}
