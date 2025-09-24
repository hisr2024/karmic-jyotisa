import type { ChartFacts, RuleHit, Analysis } from './types'

const rules = [
  {
    id: 'R_SCHOLAR_JUP_5', themeKey:'SCHOLAR', base:0.6,
    when: (cf:ChartFacts) => {
      const j = cf.placements.find(p=>p.planet==='JUPITER')
      return j?.house===5
    },
    why: (cf:ChartFacts) => {
      const j = cf.placements.find(p=>p.planet==='JUPITER')
      const notes = [`Jupiter in 5th (house of pūrvapuṇya & learning).`]
      if(j?.dignity==='EXALTED'||j?.dignity==='OWN') notes.push(`Jupiter dignified (${j.dignity}).`)
      return notes
    }
  },
  {
    id: 'R_MOKSHA_KETU_12', themeKey:'MOKSHA', base:0.55,
    when: (cf:ChartFacts) => cf.placements.some(p=>p.planet==='KETU' && p.house===12),
    why: () => [`Ketu in 12th (mokṣa/letting-go axis).`]
  },
]

export function analyze(cf: ChartFacts): Analysis {
  const hits: RuleHit[] = []
  for(const r of rules){ if(r.when(cf)){ hits.push({ id:r.id, themeKey:r.themeKey, score:r.base, why:r.why(cf) }) } }

  // Aggregate themes
  const themeScores: Record<string, number> = {}
  hits.forEach(h => { themeScores[h.themeKey] = (themeScores[h.themeKey]||0) + h.score })

  const themes = Object.entries(themeScores).map(([key,score])=>({ key, score, bullets:[] }))
  themes.sort((a,b)=>b.score-a.score)

  const basis = hits.flatMap(h=>h.why)
  return { themes, hits, basis }
}
