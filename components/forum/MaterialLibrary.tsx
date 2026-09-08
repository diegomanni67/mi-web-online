"use client"

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Download, ExternalLink, FileAudio, FileText, GraduationCap, Loader2 } from 'lucide-react'

type Material = {
  id:number; title:string; description:string|null; space:'academy'|'studio'|'all'; category:string;
  source_type:'upload'|'link'; file_name:string|null; mime_type:string|null; file_size_bytes:number|null; created_at:string
}

const tabs = [
  ['all','All'],['books','Books'],['study-guides','Study guides'],['audio','Audio'],['exam-practice','Exam practice'],['links','Links'],
] as const

function icon(category:string){
  if(category==='audio') return <FileAudio className="h-5 w-5"/>
  if(category==='exam-practice') return <GraduationCap className="h-5 w-5"/>
  if(category==='books' || category==='study-guides') return <BookOpen className="h-5 w-5"/>
  return <FileText className="h-5 w-5"/>
}
function sizeLabel(value:number|null){ if(!value)return ''; if(value<1024*1024)return `${Math.max(1,Math.round(value/1024))} KB`; return `${(value/1024/1024).toFixed(1)} MB` }

export function MaterialLibrary({ onBack }: { onBack:()=>void }) {
  const [materials,setMaterials]=useState<Material[]>([])
  const [tab,setTab]=useState('all')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{ fetch('/api/materials',{cache:'no-store'}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not load materials');setMaterials(d.materials||[])}).catch(e=>setError(e.message)).finally(()=>setLoading(false)) },[])
  const visible=useMemo(()=>tab==='all'?materials:materials.filter(m=>m.category===tab),[materials,tab])

  async function openMaterial(item:Material){
    setError('')
    try { const r=await fetch(`/api/materials/${item.id}/download`,{cache:'no-store'}); const d=await r.json(); if(!r.ok)throw new Error(d.error||'Could not open material'); window.open(d.url,'_blank','noopener,noreferrer') }
    catch(e){setError(e instanceof Error?e.message:'Could not open material')}
  }

  return <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <button onClick={onBack} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/65 hover:bg-white/10 hover:text-white">← Back to community</button>
      <div className="mt-8 rounded-[2rem] border border-amber-500/15 bg-amber-500/[0.035] p-5 sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300"><BookOpen className="h-6 w-6"/></div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-amber-300">Koterie resources</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Material</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/48">Books, guides, audio and practice selected by the Koterie teachers. Files are private and available only inside the student area.</p>
        <div className="mt-7 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">{tabs.map(([value,label])=><button key={value} onClick={()=>setTab(value)} className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold sm:rounded-full sm:px-4 ${tab===value?'border-amber-400/30 bg-amber-400/15 text-amber-200':'border-white/10 bg-white/[0.035] text-white/50 hover:text-white'}`}>{label}</button>)}</div>
      </div>

      {error && <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
      {loading ? <div className="flex items-center gap-2 py-16 text-white/40"><Loader2 className="h-5 w-5 animate-spin"/>Loading materials…</div> : visible.length===0 ?
        <div className="mt-6 rounded-3xl border border-dashed border-white/10 p-8 text-center sm:p-12"><BookOpen className="mx-auto h-10 w-10 text-white/20"/><h2 className="mt-4 text-xl font-bold text-white/65">No material published here yet</h2><p className="mt-2 text-sm text-white/35">When a teacher shares something real, it will appear here.</p></div> :
        <div className="mt-6 grid gap-4 md:grid-cols-2">{visible.map(item=><article key={item.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-300">{icon(item.category)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{item.title}</h3><span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/35">{item.space}</span></div>{item.description&&<p className="mt-2 text-sm leading-6 text-white/45">{item.description}</p>}<p className="mt-3 text-xs text-white/25">{item.file_name||item.category}{item.file_size_bytes?` · ${sizeLabel(Number(item.file_size_bytes))}`:''}</p></div></div>
          <button onClick={()=>openMaterial(item)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-300 sm:w-auto">{item.source_type==='link'?<ExternalLink className="h-4 w-4"/>:<Download className="h-4 w-4"/>}{item.source_type==='link'?'Open link':'Download'}</button>
        </article>)}</div>}
    </div>
  </main>
}
