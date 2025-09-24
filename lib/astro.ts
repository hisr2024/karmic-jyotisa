import type { BirthInput, ChartFacts } from './types'

// Very rough demo: derive a deterministic asc sign from date and lon
function pseudoAscSign(b: BirthInput): number {
  const seed = new Date(`${b.date}T${b.time}:00Z`).getTime()/86400000 + b.lon/15
  const idx = Math.abs(Math.floor(seed % 12))
  return (idx % 12) + 1 // 1..12
}

// Map sign dignity for Jupiter (demo only)
function dignityFor(planet:string, sign:number): ChartFacts['placements'][number]['dignity']{
  if(planet==='JUPITER'){ if(sign===9) return 'OWN'; if(sign===4) return 'EXALTED' }
  return 'NEUTRAL'
}

export function buildChart(b: BirthInput): ChartFacts {
  const asc = pseudoAscSign(b)
  const houses: Record<number, number[]> = {}
  for(let h=1; h<=12; h++){ houses[h] = [ ((asc + h -2) % 12) + 1 ] }

  // Place Jupiter and Ketu with simple patterns to demo rule triggers
  const jupSign = houses[5][0] // put Jupiter in 5th whole sign
  const ketuSign = houses[12][0]

  const placements: ChartFacts['placements'] = [
    { planet:'JUPITER', sign:jupSign, house:5, dignity: dignityFor('JUPITER', jupSign) },
    { planet:'KETU', sign:ketuSign, house:12, dignity: 'NEUTRAL' },
  ]

  return { system:{ zodiac:'SIDEREAL', ayanamsha:'LAHIRI', houseSystem:'WHOLE_SIGN' }, ascSign: asc, houses, placements }
}
