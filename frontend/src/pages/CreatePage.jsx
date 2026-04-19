import { useState, useRef } from 'react'
import { ArrowLeft, ArrowRight, Save, Upload, FileText, X, Edit3, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { generateFromPDF } from '../utils/api.js'
import { uid } from '../utils/storage.js'

const EMOJIS = ['📖','🧪','🌍','🔢','🧬','⚡','🎨','📐','🏛️','🌿','🔬','💡','🎭','🌊','🚀','🎯','⚗️','🦋','🧠','🔭']
const MSGS   = ['Extracting text from PDF…','Identifying key concepts…','Crafting definition cards…','Building relationship cards…','Adding hints and difficulty ratings…','Finalising your deck…']

export default function CreatePage ({ onCreated, onBack }) {
  const [step, setStep]     = useState(0)  // 0 upload | 1 config | 2 generating | 3 preview
  const [file, setFile]     = useState(null)
  const [title, setTitle]   = useState('')
  const [emoji, setEmoji]   = useState('📖')
  const [cards, setCards]   = useState([])
  const [error, setError]   = useState('')
  const [busy, setBusy]     = useState(false)
  const [msgI, setMsgI]     = useState(0)
  const msgTimer = useRef(null)

  const pickFile = f => {
    if (!f) return
    if (f.type !== 'application/pdf') { setError('Please upload a PDF file.'); return }
    if (f.size > 50*1024*1024)        { setError('File too large. Max 50 MB.'); return }
    setError(''); setFile(f)
    if (!title) setTitle(f.name.replace(/\.pdf$/i,'').replace(/[_-]/g,' '))
  }

  const generate = async () => {
    if (!file) { setError('Please upload a PDF first.'); return }
    setBusy(true); setError('')
    setMsgI(0)
    msgTimer.current = setInterval(() => setMsgI(i => (i+1) % MSGS.length), 2200)
    try {
      const { cards: raw } = await generateFromPDF(file, title)
      if (!raw?.length) throw new Error('No cards generated. Try a different PDF.')
      setCards(raw.map(c => ({ ...c, id: uid(), repetitions:0, easeFactor:2.5, interval:1, nextReview:null, lastReviewed:null })))
      setStep(3)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStep(1)
    } finally {
      clearInterval(msgTimer.current); setBusy(false)
    }
  }

  const save = () => {
    if (!cards.length) return
    onCreated({ id:uid(), title:title.trim()||'Untitled Deck', emoji, cards, createdAt:new Date().toISOString() })
  }

  const di = step===3 ? 2 : step < 2 ? step : 1
  const STEPS = ['Upload PDF','Configure','Review Cards']

  return (
    <div style={{ padding:'36px 0 80px', background:'var(--bg-soft)', minHeight:'100vh' }}>
      <div className="container" style={{ maxWidth:700 }}>
        {/* back + title */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack}><ArrowLeft size={15}/> Back</button>
          <div>
            <h1 style={{ fontSize:21, fontWeight:800 }}>Create New Deck</h1>
            <p style={{ color:'var(--text2)', fontSize:13.5 }}>Upload a PDF and AI generates your flashcards</p>
          </div>
        </div>

        {/* step indicator */}
        {!busy && (
          <div style={{ display:'flex', alignItems:'center', marginBottom:28 }}>
            {STEPS.map((label,i) => {
              const done=di>i, active=di===i
              return (
                <div key={label} style={{ display:'flex', alignItems:'center', flex:i<STEPS.length-1?1:'none' }}>
                  <div className={`step-dot ${done?'done':active?'active':'idle'}`}>{done?'✓':i+1}</div>
                  <span style={{ fontSize:12.5, fontWeight:600, color:active?'var(--primary)':'var(--text3)', marginLeft:7, whiteSpace:'nowrap' }}>{label}</span>
                  {i<STEPS.length-1 && <div style={{ flex:1, height:2, background:done?'var(--green)':'var(--border)', margin:'0 10px' }} />}
                </div>
              )
            })}
          </div>
        )}

        {/* ── Step 0: Upload ── */}
        {step===0 && (
          <div className="fade-up">
            <UploadZone file={file} onFile={pickFile} onError={setError} />
            {error && <div className="alert alert-error" style={{ marginTop:14 }}>⚠️ {error}</div>}
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:18 }}>
              <button className="btn btn-primary btn-lg" disabled={!file} onClick={()=>{setError('');setStep(1)}}>
                Configure <ArrowRight size={17}/>
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Config ── */}
        {step===1 && !busy && (
          <div className="fade-up">
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:18, padding:26, marginBottom:14 }}>
              {/* file pill */}
              <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--green-light)', border:'1px solid #A7F3D0', borderRadius:10, padding:'9px 14px', marginBottom:20 }}>
                <FileText size={16} color="var(--green)" />
                <span style={{ fontSize:13.5, fontWeight:600, color:'var(--green)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file?.name}</span>
                <button onClick={()=>{setFile(null);setStep(0)}} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex', alignItems:'center' }}><X size={14}/></button>
              </div>

              {/* title */}
              <div style={{ marginBottom:18 }}>
                <label className="lbl">Deck Title</label>
                <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Chapter 5 — Quadratic Equations" maxLength={80} />
              </div>

              {/* emoji */}
              <div style={{ marginBottom:18 }}>
                <label className="lbl">Pick an Icon</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                  {EMOJIS.map(e=>(
                    <button key={e} onClick={()=>setEmoji(e)} style={{ width:40, height:40, borderRadius:9, border:`2px solid ${emoji===e?'var(--primary)':'var(--border)'}`, background:emoji===e?'var(--primary-light)':'#fff', fontSize:19, cursor:'pointer', transition:'all .15s', display:'flex', alignItems:'center', justifyContent:'center' }}>{e}</button>
                  ))}
                </div>
              </div>

              {/* security note
              <div className="alert alert-info" style={{ fontSize:12.5 }}>
                🔒 Flashcards are generated securely on the server — no API key needed from you.
              </div> */}
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom:14 }}>⚠️ {error}</div>}
            <div style={{ display:'flex', gap:9 }}>
              <button className="btn btn-white btn-lg" onClick={()=>{setStep(0);setError('')}}><ArrowLeft size={17}/> Back</button>
              <button className="btn btn-purple btn-lg" style={{ flex:1 }} onClick={generate} disabled={!file}>⚡ Generate Flashcards with AI</button>
            </div>
          </div>
        )}

        {/* ── Generating ── */}
        {busy && (
          <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:18 }}>
            <div style={{ textAlign:'center', padding:'60px 24px' }}>
              <div style={{ position:'relative', display:'inline-block', marginBottom:28 }}>
                <div style={{ width:88, height:88, borderRadius:24, background:'linear-gradient(135deg,var(--primary),var(--accent))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, boxShadow:'var(--shadow-pl)', animation:'pulse 2s ease-in-out infinite' }}>⚡</div>
                {[0,1,2].map(i=>(
                  <div key={i} style={{ position:'absolute', width:11, height:11, borderRadius:'50%', background:['var(--primary)','var(--accent)','var(--green)'][i], top:'50%', left:'50%', transform:`rotate(${i*120}deg) translate(52px) rotate(-${i*120}deg)`, marginTop:-5.5, marginLeft:-5.5, animation:`rotate ${1.4+i*0.3}s linear infinite` }} />
                ))}
              </div>
              <h3 style={{ fontSize:21, fontWeight:800, marginBottom:9 }}>Generating Your Flashcards</h3>
              <p style={{ color:'var(--primary)', fontSize:14.5, fontWeight:600, marginBottom:5, minHeight:22 }}>{MSGS[msgI]}</p>
              <p style={{ color:'var(--text3)', fontSize:13, marginBottom:36 }}>AI is reading your PDF and crafting comprehensive study cards</p>
              <div style={{ maxWidth:340, margin:'0 auto', height:5, borderRadius:99, background:'linear-gradient(90deg,var(--primary-light),var(--primary),var(--accent),var(--primary-light))', backgroundSize:'200% 100%', animation:'shimmer 1.8s linear infinite' }} />
              <p style={{ color:'var(--text3)', fontSize:12, marginTop:16 }}>Usually takes 10–20 seconds</p>
            </div>
          </div>
        )}

        {/* ── Step 3: Preview ── */}
        {step===3 && !busy && (
          <div className="fade-up">
            <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:18, padding:26, marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <div>
                  <h3 style={{ fontSize:17, fontWeight:800 }}>Review Your Cards</h3>
                  <p style={{ color:'var(--text2)', fontSize:13.5, marginTop:2 }}>{emoji} <strong>{title}</strong></p>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={()=>{setStep(1);setError('')}}>← Regenerate</button>
              </div>
              <CardPreview cards={cards} setCards={setCards} />
            </div>
            <div style={{ display:'flex', gap:9 }}>
              <button className="btn btn-white btn-lg" onClick={()=>{setStep(1);setError('')}}><ArrowLeft size={17}/> Back</button>
              <button className="btn btn-primary btn-lg" style={{ flex:1 }} onClick={save} disabled={!cards.length}>
                <Save size={17}/> Save {cards.length} Cards to Library
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function UploadZone ({ file, onFile, onError }) {
  const [drag, setDrag] = useState(false)
  const ref = useRef()

  if (file) return (
    <div style={{ border:'2px solid var(--green)', borderRadius:14, padding:'18px 22px', background:'var(--green-light)', display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:42, height:42, background:'#fff', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><FileText size={20} color="var(--green)" /></div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:700, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</p>
        <p style={{ fontSize:12.5, color:'var(--green)', marginTop:2 }}>✅ {(file.size/1024).toFixed(0)} KB — ready</p>
      </div>
      <button onClick={()=>onFile(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', padding:4 }}><X size={17}/></button>
    </div>
  )

  return (
    <div style={{ border:`2px dashed ${drag?'var(--primary)':'var(--border2)'}`, borderRadius:14, padding:'48px 28px', textAlign:'center', cursor:'pointer', background:drag?'var(--primary-light)':'#fff', transition:'all .2s' }}
      onClick={()=>ref.current.click()}
      onDragOver={e=>{e.preventDefault();setDrag(true)}}
      onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);onFile(e.dataTransfer.files[0])}}
    >
      <div style={{ width:58, height:58, background:drag?'#fff':'var(--primary-light)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
        <Upload size={26} color="var(--primary)" />
      </div>
      <p style={{ fontWeight:700, fontSize:15.5, marginBottom:5 }}>{drag?'Drop it here!':'Drag & drop your PDF here'}</p>
      <p style={{ color:'var(--text2)', fontSize:13.5, marginBottom:18 }}>Textbook chapters, lecture notes, study guides</p>
      <button className="btn btn-primary" style={{ pointerEvents:'none' }}><Upload size={15}/> Choose PDF</button>
      <p style={{ color:'var(--text3)', fontSize:12, marginTop:11 }}>Max 50 MB · PDF only</p>
      <input ref={ref} type="file" accept=".pdf,application/pdf" style={{ display:'none' }} onChange={e=>onFile(e.target.files[0])} />
    </div>
  )
}

function CardPreview ({ cards, setCards }) {
  const [editId, setEditId]     = useState(null)
  const [expandId, setExpandId] = useState(null)

  const remove = id => setCards(p=>p.filter(c=>c.id!==id))
  const save   = (id,q,a) => { setCards(p=>p.map(c=>c.id===id?{...c,question:q,answer:a}:c)); setEditId(null) }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <p style={{ color:'var(--text2)', fontSize:13.5 }}>Review and edit before saving.</p>
        <span style={{ background:'var(--primary-light)', color:'var(--primary)', borderRadius:99, padding:'3px 11px', fontSize:12.5, fontWeight:700 }}>{cards.length} cards</span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:7, maxHeight:'50vh', overflowY:'auto', paddingRight:3 }}>
        {cards.map((card,i)=>(
          editId===card.id
            ? <EditRow key={card.id} card={card} onSave={save} onCancel={()=>setEditId(null)} />
            : <ViewRow key={card.id} card={card} index={i} expanded={expandId===card.id} onToggle={()=>setExpandId(expandId===card.id?null:card.id)} onEdit={()=>setEditId(card.id)} onRemove={()=>remove(card.id)} />
        ))}
      </div>
    </div>
  )
}

function ViewRow ({ card, index, expanded, onToggle, onEdit, onRemove }) {
  const dc = card.difficulty==='hard'?'#DC2626':card.difficulty==='medium'?'#D97706':'#059669'
  const db = card.difficulty==='hard'?'#FEF2F2':card.difficulty==='medium'?'#FFFBEB':'#ECFDF5'
  return (
    <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:12 }}>
      <div style={{ padding:'12px 14px', display:'flex', alignItems:'flex-start', gap:10 }}>
        <span style={{ color:'var(--text3)', fontSize:11.5, fontWeight:700, minWidth:22, marginTop:2 }}>Q{index+1}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontWeight:600, fontSize:13.5, lineHeight:1.4 }}>{card.question}</p>
          {expanded && (
            <div style={{ marginTop:7, paddingTop:7, borderTop:'1px solid var(--border)' }}>
              <p style={{ color:'var(--text2)', fontSize:13, lineHeight:1.55 }}>{card.answer}</p>
              {card.hint && <p style={{ color:'var(--primary)', fontSize:12, marginTop:5, fontStyle:'italic' }}>💡 {card.hint}</p>}
              {card.tags?.length > 0 && <div style={{ display:'flex', gap:4, marginTop:7, flexWrap:'wrap' }}>{card.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>}
            </div>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
          <span style={{ background:db, color:dc, borderRadius:99, padding:'2px 8px', fontSize:10.5, fontWeight:700, textTransform:'capitalize' }}>{card.difficulty}</span>
          {[
            { icon:expanded?<ChevronUp size={13}/>:<ChevronDown size={13}/>, fn:onToggle },
            { icon:<Edit3  size={13}/>, fn:onEdit,   hc:'var(--primary)' },
            { icon:<Trash2 size={13}/>, fn:onRemove, hc:'var(--red)' },
          ].map((b,i)=>(
            <button key={i} onClick={b.fn} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', padding:3, display:'flex', alignItems:'center', transition:'color .15s' }}
              onMouseEnter={e=>e.currentTarget.style.color=b.hc||'var(--text)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}
            >{b.icon}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function EditRow ({ card, onSave, onCancel }) {
  const [q,setQ]=useState(card.question); const [a,setA]=useState(card.answer)
  return (
    <div style={{ background:'#fff', border:'2px solid var(--primary)', borderRadius:12, padding:'14px 18px' }}>
      <div style={{ marginBottom:9 }}>
        <label className="lbl">Question</label>
        <textarea value={q} onChange={e=>setQ(e.target.value)} rows={2} style={{ fontSize:13.5 }} />
      </div>
      <div style={{ marginBottom:11 }}>
        <label className="lbl">Answer</label>
        <textarea value={a} onChange={e=>setA(e.target.value)} rows={3} style={{ fontSize:13.5 }} />
      </div>
      <div style={{ display:'flex', gap:7 }}>
        <button className="btn btn-primary btn-sm" onClick={()=>onSave(card.id,q,a)}><Check size={13}/> Save</button>
        <button className="btn btn-ghost btn-sm"   onClick={onCancel}><X size={13}/> Cancel</button>
      </div>
    </div>
  )
}
