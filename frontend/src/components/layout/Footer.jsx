import { Zap } from 'lucide-react'
export default function Footer () {
  return (
    <footer style={{ borderTop:'1px solid var(--border)', background:'#FAFBFF', padding:'28px 0', marginTop:80 }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26, height:26, borderRadius:7, background:'linear-gradient(135deg,var(--primary),var(--accent))', display:'flex', alignItems:'center', justifyContent:'center' }}><Zap size={13} color="white" fill="white" /></div>
          <span style={{ fontFamily:'Syne', fontWeight:800, fontSize:14 }}>FlashForge</span>
        </div>
        <p style={{ color:'var(--text3)', fontSize:13 }}>AI-powered spaced repetition · Cuemath AI Builder Challenge</p>
      </div>
    </footer>
  )
}
