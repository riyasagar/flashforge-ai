import { useState, useEffect, useRef } from 'react'
import { getUID, saveLocal, loadLocal, uid } from './utils/storage.js'
import { loadDecks, saveDecks, deleteDeck } from './utils/api.js'
import Navbar      from './components/layout/Navbar.jsx'
import Footer      from './components/layout/Footer.jsx'
import Landing     from './pages/Landing.jsx'
import Dashboard   from './pages/Dashboard.jsx'
import CreatePage  from './pages/CreatePage.jsx'
import StudyPage   from './pages/StudyPage.jsx'

export default function App () {
  const [page, setPage]       = useState('landing')
  const [decks, setDecks]     = useState([])
  const [active, setActive]   = useState(null)
  const userId  = useRef(getUID())
  const syncRef = useRef(null)

  // Boot: local first (instant), then server (freshest)
  useEffect(() => {
    const local = loadLocal()
    if (local.length) setDecks(local)
    loadDecks(userId.current).then(srv => {
      if (srv.length) { setDecks(srv); saveLocal(srv) }
    }).catch(() => {})
  }, [])

  // Debounced sync to server
  useEffect(() => {
    saveLocal(decks)
    clearTimeout(syncRef.current)
    syncRef.current = setTimeout(() => {
      saveDecks(userId.current, decks).catch(() => {})
    }, 1500)
    return () => clearTimeout(syncRef.current)
  }, [decks])

  const addDeck    = d  => setDecks(p => [d, ...p])
  const updateDeck = d  => { setDecks(p => p.map(x => x.id===d.id?d:x)); if(active?.id===d.id) setActive(d) }
  const removeDeck = id => { setDecks(p=>p.filter(x=>x.id!==id)); deleteDeck(userId.current,id).catch(()=>{}); setPage('dashboard'); setActive(null) }

  const exportDecks = () => {
    const a = Object.assign(document.createElement('a'),{
      href: URL.createObjectURL(new Blob([JSON.stringify({v:2,at:new Date().toISOString(),decks},null,2)],{type:'application/json'})),
      download: `flashforge-${Date.now()}.json`
    }); a.click(); URL.revokeObjectURL(a.href)
  }
  const importDecks = imported => setDecks(p => [...imported.map(d=>({...d,id:uid(),cards:(d.cards||[]).map(c=>({...c,id:uid()}))})), ...p])

  const showNav    = page !== 'study'
  const showFooter = page === 'landing'

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', display:'flex', flexDirection:'column' }}>
      {showNav && <Navbar page={page} setPage={setPage} count={decks.length} />}
      <main style={{ flex:1, paddingTop: showNav ? 'var(--nav-h)' : 0 }}>
        {page==='landing'   && <Landing   onStart={()=>setPage('create')} />}
        {page==='dashboard' && <Dashboard decks={decks} onStudy={d=>{setActive(d);setPage('study')}} onDelete={removeDeck} onNew={()=>setPage('create')} onExport={exportDecks} onImport={importDecks} />}
        {page==='create'    && <CreatePage onCreated={d=>{addDeck(d);setPage('dashboard')}} onBack={()=>setPage(decks.length?'dashboard':'landing')} />}
        {page==='study' && active && <StudyPage deck={active} onUpdate={updateDeck} onBack={()=>setPage('dashboard')} />}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
