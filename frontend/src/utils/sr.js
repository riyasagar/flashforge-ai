export function calcNext (card, q) {
  let { repetitions:r=0, easeFactor:ef=2.5, interval:iv=1 } = card
  if (q >= 3) { iv = r===0?1:r===1?6:Math.round(iv*ef); r++ }
  else { r=0; iv=1 }
  ef = Math.max(1.3, parseFloat((ef+0.1-(5-q)*(0.08+(5-q)*0.02)).toFixed(2)))
  const next = new Date(); next.setDate(next.getDate()+iv)
  return { repetitions:r, easeFactor:ef, interval:iv, nextReview:next.toISOString(), lastReviewed:new Date().toISOString() }
}
export function isDue   (c) { return !c.nextReview || new Date(c.nextReview)<=new Date() }
export function level   (c) { const r=c.repetitions||0; return r===0?'new':r<=2?'learning':r<=5?'reviewing':'mastered' }
export function stats   (cards=[]) {
  const t=cards.length, d=cards.filter(isDue).length, m=cards.filter(c=>level(c)==='mastered').length
  return { total:t, due:d, mastered:m, pct: t?Math.round(m/t*100):0 }
}
export function sort (cards) {
  const o={new:0,learning:1,reviewing:2,mastered:3}
  return [...cards].sort((a,b)=>{ const ad=isDue(a),bd=isDue(b); if(ad&&!bd)return -1; if(!ad&&bd)return 1; return o[level(a)]-o[level(b)] })
}
