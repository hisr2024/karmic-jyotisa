import React, { useState } from 'react'
import ScoreCircle from './ScoreCircle'
import { t } from '../lib/i18n'
import type { Lang } from '../lib/types'

export default function ThemeCard({ lang, mode, theme, basis }:{ lang:Lang; mode:'genz'|'classic'|'scholar'; theme:{ key:string; score:number }; basis:string[] }){
  const palette = mode==='genz'? 'from-indigo-500 via-fuchsia-500 to-rose-500' : mode==='classic'? 'from-slate-600 via-slate-500 to-slate-400' : 'from-emerald-600 via-teal-500 to-cyan-500'
  const [open,setOpen]=useState<string|null>(null)
  const isScholar = theme.key==='SCHOLAR'
  const title = isScholar ? t('theme.scholar', lang) : 'Mokṣa Current'
  const head = isScholar ? t('theme.scholar.head', lang) : (lang==='en'?'Signals of renunciation and release.': lang==='hi'?'वैराग्य व त्याग के संकेत।':'वैराग्यस्य मोक्षस्य च संकेताः।')
  return (
    <div className={`rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br ${palette}`}>
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">{title} {mode==='genz' && <span>{isScholar?'\ud83d\udcda\u2728':'\ud83d\udd4d\ufe0f\ud83c\udf19'}</span>}</h2>
            <p className="mt-1 text-white/90 max-w-2xl">{head}</p>
          </div>
          <ScoreCircle value={Math.round(Math.min(99, theme.score*100))} label={t('ui.confidence', lang)} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {basis.map((b, i) => (
            <span key={i} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur text-sm border border-white/20">{b}</span>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {['simple','sanskrit','commentary'].map(id=> (
            <button key={id} onClick={()=>setOpen(open===id?null:id)} className={`px-3 py-1.5 rounded-xl text-sm bg-white/90 text-black hover:bg-white font-medium ${open===id?'ring-2 ring-black/50':''}`}>{t(`bubble.${id}`, lang)}</button>
          ))}
        </div>
        <div className="relative mt-4">
          {open && (
            <div className="rounded-2xl p-4 md:p-5 bg-black/50 border border-white/15 backdrop-blur-lg transition-opacity duration-200">
              {open==='sanskrit'? (
                <div>
                  <p className="text-lg leading-relaxed">पञ्चमे भावे बलवान् गुरुः सन् विद्यायां पूर्वपुण्यं दर्शयति।</p>
                  <p className="mt-2 text-slate-200 italic">pañcame bhāve balavān guruḥ san vidyāyāṁ pūrvapuṇyaṁ darśayati.</p>
                  <p className="mt-2">{lang==='en'?"When Jupiter is strong in the 5th house, it indicates past merit in learning.":lang==='hi'?"यदि पंचम भाव में बलवान बृहस्पति हो, तो विद्या में पूर्व पुण्य का संकेत होता है।":"पञ्चमे भावे बलवति गुरौ विद्यायां पूर्वपुण्यलक्षणम्।"}</p>
                  <p className="mt-2 text-xs text-slate-300">Parāśara tradition (5th‑house effects)</p>
                </div>
              ) : open==='commentary'? (
                <p>{lang==='en'?"Tradition links a strong Jupiter in the 5th with carried merit in study, guidance, and teaching.":lang==='hi'?"परंपरा पंचमस्थ बलवान् बृहस्पति को अध्ययन, मार्गदर्शन व अध्यापन के पूर्व पुण्य से जोड़ती है।":"पञ्चमे बलवति गुरौ अध्ययनोपदेशशिक्षणेषु पूर्वपुण्यसम्बन्धः।"}</p>
              ) : (
                <p>{lang==='en'?"Think of it like study credits carried over from a previous semester of life.":lang==='hi'?"मानो पिछले जन्म की पढ़ाई के क्रेडिट्स साथ आए हों।":"यथा पूर्वजन्मात् अध्ययनफलानि समनीयन्ते।"}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
