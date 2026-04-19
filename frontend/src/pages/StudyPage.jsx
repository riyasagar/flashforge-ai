import { useState, useEffect, useCallback } from 'react'
import { X, Clock, BookOpen, Lightbulb, RotateCcw, ArrowLeft } from 'lucide-react'
import { calcNext, isDue, level, stats, sort } from '../utils/sr.js'

export default function StudyPage ({ deck, onUpdate, onBack }) {
  const [mode, setMode]       = useState(null)
  const [cards, setCards]     = useState([])
  const [idx, setIdx]         = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState({ correct:0, hard:0, total:0 })
  const [done, setDone]       = useState(false)
  const [anim, setAnim]       = useState(false)
  const [hint, setHint]       = useState(false)

  const ds       = stats(deck.cards || [])
  const dueCards = (deck.cards || []).filter(isDue)

  const start = m => {
    const pool = m==='due' ? sort(dueCards) : sort(deck.cards||[])
    setCards(pool); setMode(m); setIdx(0)
    setFlipped(false); setHint(false)
    setSession({correct:0,hard:0,total:0}); setDone(false)
  }

  const cur      = cards[idx]
  const progress = cards.length ? Math.round(idx/cards.length*100) : 0

  const rate = useCallback(q => {
    if (anim || !cur) return
    setAnim(true)
    const updated  = { ...cur, ...calcNext(cur, q) }
    const newDeck  = { ...deck, cards: deck.cards.map(c=>c.id===updated.id?updated:c) }
    onUpdate(newDeck)
    setSession(p=>({ total:p.total+1, correct:q>=3?p.correct+1:p.correct, hard:q<3?p.hard+1:p.hard }))
    setTimeout(()=>{
      const next = idx+1
      if (next >= cards.length) setDone(true)
      else { setFlipped(false); setHint(false); setIdx(next) }
      setAnim(false)
    }, 280)
  }, [anim, cur, idx, cards, deck, onUpdate])

  useEffect(()=>{
    const h = e => {
      if (!mode||done) return
      if (e.code==='Space'){ e.preventDefault(); if(!anim) setFlipped(f=>!f) }
      if (flipped&&!anim){ if(e.key==='1')rate(0); if(e.key==='2')rate(2); if(e.key==='3')rate(3); if(e.key==='4')rate(5) }
    }
    window.addEventListener('keydown',h)
    return ()=>window.removeEventListener('keydown',h)
  },[flipped,done,anim,mode,rate])

  /* ── Mode picker ── */
  if (!mode) return (
    <div style={{ minHeight:'100vh', background:'var(--bg-soft)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:460 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom:22 }}><X size={15}/> Exit</button>
        <h2 style={{ fontSize:23, fontWeight:800, marginBottom:3 }}>{deck.emoji} {deck.title}</h2>
        <p style={{ color:'var(--text2)', fontSize:14, marginBottom:26 }}>{ds.total} cards · {ds.pct}% mastered</p>

        <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
          {/* Due only */}
          <button disabled={dueCards.length===0} onClick={()=>start('due')} style={{ background:dueCards.length?'#fff':'#F8F8FF', border:`2px solid ${dueCards.length?'var(--amber)':'var(--border)'}`, borderRadius:16, padding:'18px 22px', textAlign:'left', cursor:dueCards.length?'pointer':'not-allowed', transition:'all .2s', opacity:dueCards.length?1:.52 }}
            onMouseEnter={e=>{if(dueCards.length){e.currentTarget.style.boxShadow='0 4px 18px rgba(217,119,6,.2)';e.currentTarget.style.transform='translateY(-2px)'}}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)'}}
          >
            <div style={{ display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:38, height:38, background:'var(--amber-light)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Clock size={19} color="var(--amber)"/></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:15 }}>Study Due Cards</div>
                <div style={{ fontSize:12.5, color:'var(--text2)' }}>Recommended · Spaced repetition at work</div>
              </div>
              <span style={{ background:'var(--amber-light)', color:'var(--amber)', borderRadius:99, padding:'3px 11px', fontSize:12.5, fontWeight:700 }}>{dueCards.length}</span>
            </div>
            {dueCards.length===0 && <p style={{ fontSize:12.5, color:'var(--text3)', marginTop:7, marginLeft:49 }}>No cards due right now — come back later or study all.</p>}
          </button>

          {/* All cards */}
          <button onClick={()=>start('all')} style={{ background:'#fff', border:'2px solid var(--primary)', borderRadius:16, padding:'18px 22px', textAlign:'left', cursor:'pointer', transition:'all .2s' }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-p)';e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)'}}
          >
            <div style={{ display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:38, height:38, background:'var(--primary-light)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><BookOpen size={19} color="var(--primary)"/></div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:15 }}>Study All Cards</div>
                <div style={{ fontSize:12.5, color:'var(--text2)' }}>Go through every card in the deck</div>
              </div>
              <span style={{ background:'var(--primary-light)', color:'var(--primary)', borderRadius:99, padding:'3px 11px', fontSize:12.5, fontWeight:700 }}>{ds.total}</span>
            </div>
          </button>
        </div>

        {/* deck progress */}
        <div style={{ marginTop:22, background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'14px 18px' }}>
          <p style={{ fontSize:12.5, fontWeight:600, color:'var(--text2)', marginBottom:9 }}>Deck Progress</p>
          <div className="prog-track lg" style={{ marginBottom:7 }}><div className="prog-fill" style={{ width:`${ds.pct}%` }}/></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text3)' }}>
            <span>{ds.mastered} mastered</span><span>{ds.pct}% complete</span>
          </div>
        </div>
      </div>
    </div>
  )

  /* ── Session done ── */
  if (done) {
    const score = session.total ? Math.round(session.correct/session.total*100) : 0
    const emoji = score>=80?'🎉':score>=60?'👍':'💪'
    const msg   = score>=80?'Excellent! Cards you know well will appear less often next time.'
                : score>=60?'Good progress! Consistency builds long-term memory.'
                : 'Keep going! Short daily sessions beat one long cram every time.'
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'var(--bg-soft)' }}>
        <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:26, padding:'44px 38px', maxWidth:440, width:'100%', textAlign:'center', boxShadow:'var(--shadow-lg)', animation:'scaleIn .3s var(--spring)' }}>
          <div style={{ width:76, height:76, background:'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius:22, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', boxShadow:'var(--shadow-p)', fontSize:38 }}>{emoji}</div>
          <h2 style={{ fontSize:26, fontWeight:800, marginBottom:5 }}>Session Complete!</h2>
          <p style={{ color:'var(--text2)', marginBottom:28, fontSize:14 }}>{deck.emoji} {deck.title}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:11, marginBottom:24 }}>
            {[{l:'Reviewed',v:session.total,c:'var(--text)'},{l:'Correct',v:session.correct,c:'var(--green)'},{l:'Score',v:score+'%',c:'var(--primary)'}].map(s=>(
              <div key={s.l} style={{ background:'var(--bg-soft)', borderRadius:12, padding:'14px 10px' }}>
                <div style={{ fontFamily:'Syne', fontSize:24, fontWeight:800, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:11.5, color:'var(--text3)', marginTop:2, fontWeight:600 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:20 }}><div className="prog-track lg"><div className="prog-fill" style={{ width:score+'%' }}/></div></div>
          <p style={{ color:'var(--text2)', fontSize:13.5, lineHeight:1.65, marginBottom:24 }}>{msg}</p>
          <div style={{ display:'flex', gap:9 }}>
            <button className="btn btn-white" style={{ flex:1 }} onClick={onBack}><ArrowLeft size={15}/> Back to Decks</button>
            <button className="btn btn-primary" style={{ flex:1 }} onClick={()=>start(mode)}><RotateCcw size={15}/> Again</button>
          </div>
        </div>
      </div>
    )
  }

  if (!cur) return null
  const lv = level(cur)

  /* ── Active study ── */
  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-soft)', display:'flex', flexDirection:'column', alignItems:'center', padding:'22px 16px' }}>
      {/* top bar */}
      <div style={{ width:'100%', maxWidth:580, display:'flex', alignItems:'center', gap:11, marginBottom:18 }}>
        <button className="btn btn-ghost btn-icon" onClick={()=>setMode(null)}><X size={17}/></button>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:12.5 }}>
            <span style={{ color:'var(--text2)', fontWeight:600 }}>
              {deck.emoji} {deck.title}
              {mode==='due' && <span style={{ marginLeft:7, background:'var(--amber-light)', color:'var(--amber)', borderRadius:99, padding:'1px 8px', fontSize:10.5, fontWeight:700 }}>DUE</span>}
            </span>
            <span style={{ color:'var(--text3)' }}>{idx+1}/{cards.length}</span>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{ width:progress+'%' }}/></div>
        </div>
      </div>

      {/* session stats */}
      <div style={{ display:'flex', gap:14, marginBottom:18, fontSize:12.5 }}>
        <span style={{ color:'var(--green)', fontWeight:700 }}>✓ {session.correct}</span>
        <span style={{ color:'var(--red)',   fontWeight:700 }}>✗ {session.hard}</span>
        <span className={`mbadge mbadge-${lv}`}>{lv}</span>
      </div>

      {/* flashcard */}
      <div style={{ width:'100%', maxWidth:580, marginBottom:22, opacity:anim?.5:1, transition:'opacity .28s', perspective:'1100px', cursor:'pointer' }} onClick={()=>{ if(!anim) setFlipped(f=>!f) }}>
        <div style={{ width:'100%', minHeight:300, position:'relative', transformStyle:'preserve-3d', transition:'transform .42s cubic-bezier(.4,.2,.2,1)', transform:flipped?'rotateY(180deg)':'rotateY(0deg)' }}>
          {/* front */}
          <div style={{ position:'absolute', width:'100%', minHeight:300, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', background:'#fff', border:'1.5px solid var(--border)', borderRadius:22, padding:'36px 32px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', boxShadow:'var(--shadow-md)' }}>
            <div style={{ position:'absolute', top:14, right:14 }}>
              <span className={`mbadge mbadge-${lv}`}>{lv}</span>
            </div>
            <div style={{ fontSize:10.5, fontWeight:700, color:'var(--text3)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:18 }}>Question</div>
            <p style={{ fontSize:19, fontWeight:700, lineHeight:1.5, color:'var(--text)' }}>{cur.question}</p>
            {cur.hint && !hint && (
              <button onClick={e=>{e.stopPropagation();setHint(true)}} style={{ marginTop:22, display:'flex', alignItems:'center', gap:6, background:'var(--amber-light)', border:'1px solid #FDE68A', borderRadius:99, padding:'6px 15px', fontSize:12.5, fontWeight:600, color:'var(--amber)', cursor:'pointer' }}>
                <Lightbulb size={13}/> Show hint
              </button>
            )}
            {hint && cur.hint && (
              <div style={{ marginTop:18, background:'var(--amber-light)', border:'1px solid #FDE68A', borderRadius:11, padding:'9px 15px', fontSize:12.5, color:'var(--amber)', fontStyle:'italic', maxWidth:400 }}>💡 {cur.hint}</div>
            )}
            <p style={{ position:'absolute', bottom:16, fontSize:11.5, color:'var(--text3)' }}>Click or press Space to reveal</p>
          </div>
          {/* back */}
          <div style={{ position:'absolute', width:'100%', minHeight:300, backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden', transform:'rotateY(180deg)', background:'linear-gradient(135deg,#F0F2FF,#F5F3FF)', border:'2px solid #DDD8FF', borderRadius:22, padding:'36px 32px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', boxShadow:'var(--shadow-md)' }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:'var(--primary)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:18 }}>Answer</div>
            <p style={{ fontSize:16.5, lineHeight:1.65, color:'var(--text)' }}>{cur.answer}</p>
            {cur.tags?.length > 0 && (
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'center', marginTop:14 }}>
                {cur.tags.map(t=><span key={t} className="tag">{t}</span>)}
              </div>
            )}
            <p style={{ position:'absolute', bottom:16, fontSize:11.5, color:'var(--text3)' }}>How well did you know this?</p>
          </div>
        </div>
      </div>

      {/* rating */}
      {flipped ? (
        <div className="fade-up" style={{ width:'100%', maxWidth:580 }}>
          <p style={{ textAlign:'center', color:'var(--text2)', fontSize:13.5, fontWeight:500, marginBottom:10 }}>
            How well did you know this? <span style={{ color:'var(--text3)', fontSize:12 }}>(press 1–4)</span>
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:9 }}>
            {[
              { q:0, l:'Blackout', d:'Complete blank',      c:'#DC2626', bg:'#FEF2F2', b:'#FECACA', k:'1' },
              { q:2, l:'Hard',     d:'Wrong but familiar',  c:'#D97706', bg:'#FFFBEB', b:'#FDE68A', k:'2' },
              { q:3, l:'Good',     d:'Correct with effort', c:'#2563EB', bg:'#EFF6FF', b:'#BFDBFE', k:'3' },
              { q:5, l:'Easy',     d:'Perfect recall',      c:'#059669', bg:'#ECFDF5', b:'#A7F3D0', k:'4' },
            ].map(r=>(
              <button key={r.q} onClick={()=>rate(r.q)} style={{ padding:'13px 7px', borderRadius:13, border:`2px solid ${r.b}`, background:r.bg, cursor:'pointer', transition:'all .15s', fontFamily:'inherit', display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 5px 16px rgba(0,0,0,.1)';e.currentTarget.style.borderColor=r.c}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor=r.b}}
              >
                <div style={{ fontSize:10.5, fontWeight:800, color:'var(--text3)', letterSpacing:'.04em' }}>[{r.k}]</div>
                <div style={{ fontWeight:800, fontSize:14.5, color:r.c }}>{r.l}</div>
                <div style={{ fontSize:10.5, color:r.c, opacity:.75 }}>{r.d}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p style={{ color:'var(--text3)', fontSize:13, fontWeight:500 }}>
          Click card or press <kbd style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:5, padding:'2px 7px', fontSize:11.5 }}>Space</kbd> to flip
        </p>
      )}
    </div>
  )
}
