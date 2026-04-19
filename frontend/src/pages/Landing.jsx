import { Upload, Sparkles, Brain, Cpu, BookOpen, BarChart2, Edit3, Lightbulb, Zap, CheckCircle } from 'lucide-react'

export default function Landing ({ onStart }) {
  return (
    <div style={{ background:'var(--bg)' }}>
      {/* ── HERO ── */}
      <section style={{ padding:'72px 0 56px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        {/* soft radial blob */}
        <div style={{ position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)', width:800, height:500, background:'radial-gradient(ellipse at center,rgba(91,75,245,0.07),transparent 68%)', pointerEvents:'none' }} />

        <div className="container" style={{ position:'relative' }}>
          {/* badge */}
          <div className="fade-up" style={{ display:'flex', justifyContent:'center', marginBottom:22 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#F0EDFF', color:'var(--primary)', borderRadius:99, padding:'5px 14px', fontSize:12.5, fontWeight:600, border:'1px solid #DDD8FF' }}>
              <Sparkles size={12} /> Powered by Groq AI
            </span>
          </div>

          {/* headline */}
          <h1 className="display fade-up" style={{ fontSize:'clamp(36px,5.5vw,62px)', lineHeight:1.1, marginBottom:18, animationDelay:'50ms', opacity:0 }}>
            Turn your notes{' '}
            <span className="gradient-text">into exam-ready</span>
            <br />cards in seconds.
          </h1>

          {/* sub */}
          <p className="fade-up" style={{ fontSize:17, color:'var(--text2)', maxWidth:500, margin:'0 auto 32px', lineHeight:1.7, animationDelay:'100ms', opacity:0 }}>
            Upload any PDF — textbook chapters, lecture notes, or study guides — and instantly get a complete set of smart flashcards ready to practice.
          </p>

          {/* CTA buttons */}
          <div className="fade-up" style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', animationDelay:'150ms', opacity:0 }}>
            <button className="btn btn-purple btn-xl" onClick={onStart} style={{ fontSize:15.5, padding:'14px 32px' }}>
              <Upload size={17} /> Make My Flashcards Now →
            </button>
            <button className="btn btn-white btn-xl" onClick={onStart} style={{ fontSize:15.5, padding:'14px 28px' }}>
              Browse Examples
            </button>
          </div>

          {/* trust pills */}
          <div className="fade-up" style={{ display:'flex', gap:20, justifyContent:'center', marginTop:24, animationDelay:'200ms', opacity:0, flexWrap:'wrap' }}>
            {['✅ Free to use','✅ No signup required','✅ Instant results'].map(t=>(
              <span key={t} style={{ fontSize:13.5, color:'var(--text2)', fontWeight:500 }}>{t}</span>
            ))}
          </div>

          {/* hero visual */}
          <div className="fade-up" style={{ marginTop:52, animationDelay:'250ms', opacity:0, display:'flex', justifyContent:'center' }}>
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:'68px 0', background:'#FAFBFF', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <h2 style={{ fontSize:30, marginBottom:8 }}>How it works</h2>
            <p style={{ color:'var(--text2)', fontSize:15, maxWidth:420, margin:'0 auto' }}>From PDF to mastery in three steps — no manual card creation ever again.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {[
              { icon:<Upload size={24} color="var(--primary)" />,  bg:'var(--primary-light)', n:'01', title:'Upload your PDF',    desc:'Drop in any study material — textbook chapters, lecture notes, research papers. Any PDF works.' },
              { icon:<Cpu    size={24} color="var(--accent)" />,   bg:'#F0EDFF',              n:'02', title:'AI generates cards', desc:'AI analyzes your PDF and generates 8–35 high-quality flashcards covering key concepts, definitions, and relationships.' },
              { icon:<BookOpen size={24} color="var(--green)" />,  bg:'var(--green-light)',   n:'03', title:'Practice & master',  desc:'Practice with spaced repetition. Difficult cards appear more often until you master them.' },
            ].map((s,i)=>(
              <div key={i} style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:18, padding:'32px 24px', textAlign:'center', position:'relative', boxShadow:'var(--shadow-sm)', transition:'all .2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.borderColor='var(--primary)' }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='var(--shadow-sm)'; e.currentTarget.style.borderColor='var(--border)' }}
              >
                <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', background:'white', border:'1.5px solid var(--border)', borderRadius:99, padding:'2px 11px', fontSize:10.5, fontWeight:800, color:'var(--text3)', letterSpacing:'.06em' }}>STEP {s.n}</div>
                <div style={{ width:58, height:58, background:s.bg, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', margin:'8px auto 18px' }}>{s.icon}</div>
                <h3 style={{ fontSize:16, marginBottom:8 }}>{s.title}</h3>
                <p style={{ color:'var(--text2)', fontSize:13.5, lineHeight:1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'68px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:44 }}>
            <h2 style={{ fontSize:30, marginBottom:8 }}>Built for real studying</h2>
            <p style={{ color:'var(--text2)', fontSize:15, maxWidth:400, margin:'0 auto' }}>Every feature exists because passive re-reading doesn't work. Active recall does.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {[
              { icon:<Brain     size={20} color="var(--primary)" />, bg:'var(--primary-light)', title:'Smart AI Generation',     desc:'Generates concept-based, definition, and application-focused flashcards — not just keywords.' },
              { icon:<BarChart2 size={20} color="var(--accent)" />,  bg:'#F0EDFF',              title:'SM-2 Spaced Repetition',  desc:'A proven spaced repetition algorithm. Struggling cards reappear sooner. Mastered cards fade away.' },
              { icon:<CheckCircle size={20} color="var(--green)"/>,  bg:'var(--green-light)',   title:'Progress Tracking',       desc:'New / Learning / Reviewing / Mastered per card. Know exactly where to focus.' },
              { icon:<Edit3     size={20} color="#D97706" />,        bg:'var(--amber-light)',   title:'Edit Before Saving',      desc:'Review all AI cards before saving. Edit or remove anything that doesn\'t fit.' },
              { icon:<Lightbulb size={20} color="var(--blue)" />,    bg:'var(--blue-light)',    title:'Hint System',             desc:'Every card has a hint that guides thinking without giving away the answer.' },
              { icon:<Zap       size={20} color="var(--red)" />,     bg:'var(--red-light)',     title:'Keyboard Shortcuts',      desc:'Space to flip. Keys 1–4 to rate. Practice feels fast and completely frictionless.' },
            ].map((f,i)=>(
              <div key={i} style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'20px', transition:'all .2s' }}
                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; e.currentTarget.style.borderColor='var(--primary)' }}
                onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--border)' }}
              >
                <div style={{ width:40, height:40, background:f.bg, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>{f.icon}</div>
                <h4 style={{ fontSize:14.5, marginBottom:5 }}>{f.title}</h4>
                <p style={{ color:'var(--text2)', fontSize:13, lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section style={{ padding:'48px 0', background:'linear-gradient(135deg,var(--primary),var(--accent))' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
            {[
              { v:'Smart', l:'Flashcards', s:'AI-generated from your study material' },
              { v:'Adaptive', l:'Learning', s:'Adjusts to your progress automatically' },
              { v:'100%',  l:'Free to use',   s:'Completely free to use' },
              { v:'∞',     l:'Decks',         s:'No limits. Create as many as you need' },
            ].map((s,i)=>(
              <div key={i} style={{ textAlign:'center', padding:'0 20px', borderRight:i<3?'1px solid rgba(255,255,255,.2)':'none' }}>
                <div style={{ fontFamily:'Syne', fontWeight:800, fontSize:38, color:'white', lineHeight:1.1, marginBottom:5 }}>{s.v}</div>
                <div style={{ color:'rgba(255,255,255,.92)', fontWeight:700, fontSize:14, marginBottom:3 }}>{s.l}</div>
                <div style={{ color:'rgba(255,255,255,.6)', fontSize:12.5 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding:'76px 0', textAlign:'center', background:'#fff', borderTop:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ maxWidth:520, margin:'0 auto' }}>
            <div style={{ fontSize:44, marginBottom:14 }}>⚡</div>
            <h2 className="display" style={{ fontSize:32, marginBottom:10 }}>Ready to study smarter?</h2>
            <p style={{ color:'var(--text2)', fontSize:16, marginBottom:28, lineHeight:1.7 }}>
              Upload your PDF and get a complete flashcard deck in seconds. No signup, no hassle — just smarter studying.
            </p>
            <button className="btn btn-purple btn-xl" onClick={onStart}>Get Started Free →</button>
          </div>
        </div>
      </section>
    </div>
  )
}

function HeroPreview () {
  return (
    <div style={{ position:'relative', width:'100%', maxWidth:660 }}>
      <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:18, padding:'24px 28px', boxShadow:'0 20px 70px rgba(91,75,245,0.13)', textAlign:'left' }}>
        {/* deck header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
          <div style={{ background:'linear-gradient(135deg,var(--primary),var(--accent))', borderRadius:9, padding:'7px 13px', color:'white', fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
            <Brain size={13} /> Photosynthesis — Chapter 4
          </div>
          <span style={{ fontSize:12.5, color:'var(--text3)' }}>20 cards generated</span>
        </div>
        {/* fake card */}
        <div style={{ background:'linear-gradient(135deg,#F0F2FF,#F5F3FF)', border:'1.5px solid #DDD8FF', borderRadius:12, padding:'22px 24px', marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'var(--primary)', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:9 }}>Question</div>
          <p style={{ fontWeight:700, fontSize:16, color:'var(--text)', marginBottom:12 }}>What is the primary function of chlorophyll in photosynthesis?</p>
          <span style={{ fontSize:12.5, color:'var(--text3)' }}>Tap to reveal answer →</span>
        </div>
        {/* rating buttons */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7 }}>
          {[{l:'Blackout',c:'#DC2626',bg:'#FEF2F2',b:'#FECACA'},{l:'Hard',c:'#D97706',bg:'#FFFBEB',b:'#FDE68A'},{l:'Good',c:'#2563EB',bg:'#EFF6FF',b:'#BFDBFE'},{l:'Easy',c:'#059669',bg:'#ECFDF5',b:'#A7F3D0'}].map(x=>(
            <div key={x.l} style={{ padding:'9px 5px', borderRadius:9, border:`1.5px solid ${x.b}`, background:x.bg, textAlign:'center', fontSize:12.5, fontWeight:700, color:x.c }}>{x.l}</div>
          ))}
        </div>
      </div>
      {/* floating badges */}
      <div className="float"  style={{ position:'absolute', top:-14, right:-14, background:'#fff', border:'1.5px solid var(--border)', borderRadius:11, padding:'7px 13px', boxShadow:'var(--shadow)', fontSize:12.5, fontWeight:600, color:'var(--green)', display:'flex', alignItems:'center', gap:5 }}>✅ 20 cards ready!</div>
      <div className="float2" style={{ position:'absolute', bottom:-12, left:-8,  background:'#fff', border:'1.5px solid var(--border)', borderRadius:11, padding:'7px 13px', boxShadow:'var(--shadow)', fontSize:12.5, fontWeight:600, color:'var(--primary)' }}>🧠 SM-2 Spaced Repetition</div>
    </div>
  )
}
