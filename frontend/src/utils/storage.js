const DKEY = 'ff_decks_v4'
const UKEY = 'ff_uid'

export function getUID () {
  let id = localStorage.getItem(UKEY)
  if (!id) { id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2,9); localStorage.setItem(UKEY, id) }
  return id
}
export function saveLocal (d)  { try { localStorage.setItem(DKEY, JSON.stringify(d)) } catch {} }
export function loadLocal ()   { try { const d = localStorage.getItem(DKEY); return d ? JSON.parse(d) : [] } catch { return [] } }
export function uid ()         { return Date.now().toString(36) + Math.random().toString(36).slice(2,9) }
