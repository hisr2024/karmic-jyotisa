'use client'
import React, { useMemo, useState } from 'react'
import { buildChart } from '../lib/astro'
import { analyze } from '../lib/rules'
import ThemeCard from '../components/ThemeCard'
import { t } from '../lib/i18n'
import type { Lang, BirthInput } from '../lib/types'

export default function Page(){
  const [lang,setLang]=useState<Lang>('en')
  const [mode,setMode]=useState<'genz'|'classic'|'scholar'>('genz')
  const [input,setInput]=useState<BirthInput>({ date:'1995-01-01', time:'12:00', tzOffsetMinutes:0, lat:28.6139, lon:77.2090 })
  const analysis = useMemo(()=> analyze(buildChart(input)), [input])

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{t('ui.title', lang)}</h1>
          <p className="text-slate-300">{t('ui.subtitle', lang)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-800/70 rounded-2xl p-1 flex gap-1">
            {[{key:'genz',label:'Gen Z'},{key:'classic',label:'Classic'},{key:'scholar',label:'Scholar'}].map(m=> (
              <button key={m.key} onClick={()=>setMode(m.key as any)} className={`px-3 py-1 rounded-xl text-sm transition-all ${mode===m.key? 'bg-white text-black':'text-slate-200 hover:bg-slate-700'}`}>{m.label}</button>
            ))}
          </div>
          <select value={lang} onChange={(e)=>setLang(e.target.value as Lang)} className="bg-slate-800/70 rounded-xl px-3 py-2 text-sm outline-none border border-slate-700 hover:border-slate-500">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="sa">Sanskrit</option>
          </select>
        </div>
      </div>

      {/* Input form */}
      <div className="max-w-5xl mx-auto mb-6 grid md:grid-cols-6 gap-3">
        {[
          {k:'date',label:'Date (YYYY-MM-DD)',type:'date'},
          {k:'time',label:'Time (HH:MM UTC)',type:'time'},
          {k:'tzOffsetMinutes',label:'TZ Offset (min)',type:'number'},
          {k:'lat',label:'Lat',type:'number',step:'0.0001'},
          {k:'lon',label:'Lon',type:'number',step:'0.0001'},
        ].map((f:any)=> (
          <div key={f.k} className="col-span-3 md:col-span-2">
            <label className="text-sm text-slate-300">{f.label}</label>
            <input value={(input as any)[f.k]} onChange={(e)=>setInput((prev:any)=>({...prev,[f.k]: f.type==='number'? Number(e.target.value): e.target.value}))} type={f.type} step={f.step} className="w-full px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-700 focus:border-slate-400 outline-none" />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto space-y-4">
        {analysis.themes.map(th => (
          <ThemeCard key={th.key} lang={lang} mode={mode} theme={th} basis={analysis.basis} />
        ))}
      </div>
    </div>
  )
}
