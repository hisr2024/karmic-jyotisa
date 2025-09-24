export type Lang = 'en'|'hi'|'sa'
export type BirthInput = { name?: string; date: string; time: string; tzOffsetMinutes: number; lat: number; lon: number }
export type ChartFacts = {
  system: { zodiac:'SIDEREAL', ayanamsha:'LAHIRI', houseSystem:'WHOLE_SIGN' },
  ascSign: number // 1..12
  houses: Record<number, number[]> // house -> signs included (whole sign)
  placements: { planet: string; sign: number; house: number; dignity:'EXALTED'|'OWN'|'FRIEND'|'NEUTRAL'|'ENEMY'|'DEBILITATED' }[]
}
export type RuleHit = { id: string; themeKey: string; score: number; why: string[] }
export type Analysis = { themes: { key: string; score: number; bullets: string[] }[]; hits: RuleHit[]; basis: string[] }
