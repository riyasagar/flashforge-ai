import { useState, useRef } from 'react'
import { Search, Plus, Download, Upload, Clock, CheckCircle, BookOpen, Play, Trash2 } from 'lucide-react'
import { stats, isDue } from '../utils/sr.js'
import { uid } from '../utils/storage.js'

export default function Dashboard ({ decks, onStudy, onDelete, onNew, onExport, onImport }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [impErr, setImpErr] = useState('')
  const fileRef = useRef()

  const filtered = decks.filter(d => {
    if (!d.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filter === 'due')      return stats(d.cards).due > 0
    if (filter === 'mastered') return stats(d.cards).pct === 100
    return true
  })

  const handleImport = e => {
    setImpErr('')
    const file = e.target.files[0]; if (!file) return
    const r = new FileReader()
    r.onload = ev => {
      try {
        const p = JSON.parse(ev.target.result)
        const arr = p.decks || (Array.isArray(p) ? p : null)
        if (!arr) throw new Error()
        onImport(arr)
      } catch { setImpErr('Invalid file. Use a FlashForge export.') }
      e.target.value = ''
    }
    r.readAsText(file)
  }

  const handleDelete = id => { if (window.confirm('Delete this deck? This cannot be undone.')) onDelete(id) }

  /* global stats */
  const totalCards    = decks.reduce((s,d) => s+(d.cards?.length||0), 0)
  const totalDue      = decks.reduce((s,d) => s+stats(d.cards).due, 0)
  const totalMastered = decks.reduce((s,d) => s+stats(d.cards).mastered, 0)

  return (
    <div style={{ padding:'40px 0 80px', background:'var(--bg-soft)', minHeight:'100vh' }}>
      <div className="container">
        {/* header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:14 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, marginBottom:3 }}>My Decks</h1>
            <p style={{ color:'var(--text2)', fontSize:14 }}>
              {decks.length === 0 ? 'No decks yet — create your first one!' : `${decks.length} deck${decks.length!==1?'s':''} in your library`}
            </p>
          </div>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
            {decks.length > 0 && <>
              <button className="btn btn-white btn-sm" onClick={onExport}><Download size={14}/> Export</button>
              <button className="btn btn-white btn-sm" onClick={()=>fileRef.current.click()}><Upload size={14}/> Import</button>
              <input ref={fileRef} type="file" accept=".json" style={{ display:'none' }} onChange={handleImport} />
            </>}
            <button className="btn btn-purple" onClick={onNew}><Plus size={17}/> New Deck</button>
          </div>
        </div>

        {impErr && <div className="alert alert-error" style={{ marginBottom:18 }}>⚠️ {impErr}</div>}

        {decks.length === 0 ? (
          <EmptyState onNew={onNew} />
        ) : (
          <>
            {/* stat cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:28 }}>
              {[
                { icon:<BookOpen    size={18} color="var(--primary)" />, bg:'var(--primary-light)', val:totalCards,    label:'Total Cards',    col:'var(--primary)' },
                { icon:<Clock       size={18} color="var(--amber)" />,   bg:'var(--amber-light)',   val:totalDue,      label:'Due for Review', col:totalDue>0?'var(--amber)':'var(--text)' },
                { icon:<CheckCircle size={18} color="var(--green)" />,   bg:'var(--green-light)',   val:totalMastered, label:'Mastered',       col:'var(--green)' },
              ].map((s,i)=>(
                <div key={i} className="scard">
                  <div className="sicon" style={{ background:s.bg }}>{s.icon}</div>
                  <div className="sval" style={{ color:s.col }}>{s.val}</div>
                  <div className="slabel">{s.label}</div>
                </div>
              ))}
            </div>

            {/* search + filter */}
            <div style={{ display:'flex', gap:10, marginBottom:22, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative', flex:'1', minWidth:200 }}>
                <Search size={15} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text3)', pointerEvents:'none' }} />
                <input type="search" placeholder="Search decks…" value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:36 }} />
              </div>
              <div className="ftabs">
                {[{k:'all',l:'All'},{k:'due',l:'⏰ Due'},{k:'mastered',l:'✅ Mastered'}].map(f=>(
                  <button key={f.k} className={`ftab ${filter===f.k?'active':''}`} onClick={()=>setFilter(f.k)}>{f.l}</button>
                ))}
              </div>
            </div>

            {/* deck grid */}
            {filtered.length === 0
              ? <div style={{ textAlign:'center', padding:'56px 0', color:'var(--text3)' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
                  <p style={{ fontWeight:600, fontSize:15 }}>No decks match</p>
                </div>
              : <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:18 }}>
                  {filtered.map(d => <DeckCard key={d.id} deck={d} onStudy={onStudy} onDelete={handleDelete} />)}
                </div>
            }
          </>
        )}
      </div>
    </div>
  )
}

function DeckCard ({ deck, onStudy, onDelete }) {
  const s = stats(deck.cards || [])
  return (
    <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:18, overflow:'hidden', boxShadow:'var(--shadow-sm)', transition:'all .2s', display:'flex', flexDirection:'column' }}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.transform='translateY(-2px)' }}
      onMouseLeave={e=>{ e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.borderColor='var(--border)';  e.currentTarget.style.transform='translateY(0)' }}
    >
      {/* mastery progress strip */}
      <div style={{ height:3, background:'#F0F0F8' }}>
        <div style={{ height:'100%', width:`${s.pct}%`, background:'linear-gradient(90deg,var(--primary),var(--accent))', transition:'width .6s' }} />
      </div>

      <div style={{ padding:'18px 18px 14px', flex:1 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:11 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'var(--primary-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
            {deck.emoji || '📖'}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            {s.due > 0 && (
              <span style={{ background:'var(--amber-light)', color:'var(--amber)', borderRadius:99, padding:'3px 9px', fontSize:11.5, fontWeight:700, display:'flex', alignItems:'center', gap:3 }}>
                <Clock size={10} /> {s.due} due
              </span>
            )}
            <button onClick={e=>{e.stopPropagation();onDelete(deck.id)}}
              style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', padding:4, borderRadius:6, display:'flex', alignItems:'center', transition:'color .15s' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--red)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}
            ><Trash2 size={14} /></button>
          </div>
        </div>

        <h3 style={{ fontSize:15, fontWeight:700, marginBottom:3, lineHeight:1.3 }}>{deck.title}</h3>
        <p style={{ color:'var(--text3)', fontSize:12.5, marginBottom:12 }}>
          {s.total} cards · {s.pct}% mastered · {new Date(deck.createdAt).toLocaleDateString()}
        </p>

        <div className="prog-track sm"><div className="prog-fill" style={{ width:`${s.pct}%` }} /></div>
      </div>

      <div style={{ padding:'0 18px 18px' }}>
        <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', fontSize:13.5, padding:'9px 0' }}
          onClick={e=>{e.stopPropagation();onStudy(deck)}}>
          <Play size={14} fill="white" /> Practice
        </button>
      </div>
    </div>
  )
}

function EmptyState ({ onNew }) {
  return (
    <div style={{ textAlign:'center', padding:'76px 24px' }}>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:28, gap:14, alignItems:'flex-end' }}>
        {[{e:'📄',bg:'var(--primary-light)',sz:58,cls:'float2'},{e:'⚡',bg:'linear-gradient(135deg,var(--primary),var(--accent))',sz:74,cls:'float',sh:true},{e:'🧠',bg:'var(--green-light)',sz:58,cls:'float2'}].map((x,i)=>(
          <div key={i} className={x.cls} style={{ width:x.sz, height:x.sz, borderRadius:18, background:x.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:x.sz*.44, boxShadow:x.sh?'var(--shadow-p)':'var(--shadow-sm)', marginBottom:i===1?7:0 }}>{x.e}</div>
        ))}
      </div>
      <h2 style={{ fontSize:24, fontWeight:800, marginBottom:9 }}>No decks yet</h2>
      <p style={{ color:'var(--text2)', fontSize:15, maxWidth:340, margin:'0 auto 28px', lineHeight:1.65 }}>
        Upload a PDF and AI turns it into a smart flashcard deck in seconds.
      </p>
      <button className="btn btn-purple btn-lg" onClick={onNew}><Upload size={17}/> Create Your First Deck</button>
    </div>
  )
}
