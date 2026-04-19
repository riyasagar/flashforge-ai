import { Zap } from 'lucide-react'

export default function Navbar ({ page, setPage, count }) {
  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, height:'var(--nav-h)', background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)', zIndex:100, display:'flex', alignItems:'center' }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%' }}>
        <button onClick={()=>setPage('landing')} style={{ display:'flex', alignItems:'center', gap:9, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,var(--primary),var(--accent))', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Zap size={17} color="white" fill="white" />
          </div>
          <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:17, color:'var(--text)' }}>FlashForge</span>
        </button>

        <div style={{ display:'flex', alignItems:'center', gap:2 }}>
          {[
            { label:'How it Works', key:'landing' },
            { label:'My Decks',     key:'dashboard', badge: count },
          ].map(item => (
            <button key={item.key} onClick={()=>setPage(item.key)} style={{ background: page===item.key?'var(--primary-light)':'none', border:'none', cursor:'pointer', padding:'6px 13px', borderRadius:'var(--r-sm)', fontFamily:'inherit', fontSize:14, fontWeight:600, color: page===item.key?'var(--primary)':'var(--text2)', transition:'all .15s', display:'flex', alignItems:'center', gap:4 }}
              onMouseEnter={e=>{ if(page!==item.key) e.currentTarget.style.background='var(--bg-soft)' }}
              onMouseLeave={e=>{ if(page!==item.key) e.currentTarget.style.background='transparent' }}
            >
              {item.label}
              {item.badge>0 && <span style={{ background:'var(--primary)', color:'white', borderRadius:99, fontSize:10, fontWeight:700, padding:'1px 6px' }}>{item.badge}</span>}
            </button>
          ))}
          <div style={{ width:1, height:18, background:'var(--border)', margin:'0 6px' }} />
          <button className="btn btn-purple btn-sm" onClick={()=>setPage('create')}>+ New Deck</button>
        </div>
      </div>
    </nav>
  )
}
