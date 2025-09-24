import React from 'react'
export default function ScoreCircle({ value, label }:{value:number; label:string}){
  const radius=28, stroke=6, size=radius*2+stroke*2, C=2*Math.PI*radius, off=C-(value/100)*C
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={radius} stroke="rgba(255,255,255,.25)" strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={radius} stroke="#fff" strokeWidth={stroke} strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round" fill="none"/>
      </svg>
      <div className="-mt-8 text-center">
        <div className="text-lg font-bold">{value}%</div>
        <div className="text-xs text-white/80">{label}</div>
      </div>
    </div>
  )
}
