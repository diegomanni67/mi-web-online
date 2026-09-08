"use client"

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, ExternalLink, FileAudio, FileText, Loader2, Upload, XCircle } from 'lucide-react'
import { useMember } from '@/components/member/useMember'

type Material = { id:number; title:string; description:string|null; space:string; category:string; source_type:'upload'|'link'; file_name:string|null; file_size_bytes:number|null; active:boolean; created_at:string }
const categories = [['books','Books'],['study-guides','Study guides'],['audio','Audio'],['exam-practice','Exam practice'],['links','Links']] as const
function fmtSize(v:number|null){ if(!v)return ''; return v<1048576?`${Math.round(v/1024)} KB`:`${(v/1048576).toFixed(1)} MB` }

export default function MaterialsAdminPage(){
  const {member,loading:memberLoading}=useMember()
  const [items,setItems]=useState<Material[]>([]),[busy,setBusy]=useState(false),[notice,setNotice]=useState('')
  const [mode,setMode]=useState<'link'|'upload'>('link')
  const [form,setForm]=useState({title:'',description:'',space:'all',category:'study-guides',externalUrl:''})
  const [file,setFile]=useState<File|null>(null)

  async function json(url:string,opts?:RequestInit){ const r=await fetch(url,{cache:'no-store',...opts,headers:{'Content-Type':'application/json',...(opts?.headers||{})}}); const d=await r.json(); if(!r.ok)throw new Error(d.error||'Could not complete the action'); return d }
  async function load(){ const d=await json('/api/admin/materials'); setItems(d.materials||[]) }
  useEffect(()=>{ if(member?.role==='teacher'||member?.role==='admin')load().catch(e=>setNotice(e.message)) },[member])
  const activeCount=useMemo(()=>items.filter(i=>i.active).length,[items])

  async function submit(e:FormEvent){
    e.preventDefault(); setBusy(true); setNotice('')
    try{
      if(mode==='link'){
        await json('/api/admin/materials',{method:'POST',body:JSON.stringify({...form,sourceType:'link'})})
      }else{
        if(!file)throw new Error('Choose a file first.')
        const p=await json('/api/admin/materials/upload-url',{method:'POST',body:JSON.stringify({fileName:file.name,mimeType:file.type,size:file.size})})
        const uploaded=await fetch(p.uploadUrl,{method:'PUT',headers:{'Content-Type':file.type},body:file})
        if(!uploaded.ok)throw new Error('The file could not be uploaded.')
        await json('/api/admin/materials',{method:'POST',body:JSON.stringify({...form,sourceType:'upload',objectKey:p.objectKey,fileName:file.name,mimeType:file.type,fileSizeBytes:file.size})})
      }
      setForm({title:'',description:'',space:'all',category:'study-guides',externalUrl:''}); setFile(null); setNotice('Material published.'); await load()
    }catch(err){setNotice(err instanceof Error?err.message:'Could not publish material')}
    finally{setBusy(false)}
  }

  if(memberLoading)return <main className="min-h-screen bg-[#080d19] p-10 text-center text-white/40">Loading…</main>
  if(!member||member.role==='student')return <main className="min-h-screen bg-[#080d19] p-10 text-center text-white"><p>Teacher access required.</p><Link href="/dashboard" className="mt-5 inline-block text-purple-300">Back</Link></main>

  return <main className="min-h-screen bg-[#080d19] px-4 py-10 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 hover:text-white"><ArrowLeft className="h-4 w-4"/>Teacher control room</Link>
    <div className="mt-7 border-b border-white/[0.07] pb-7"><p className="text-xs font-bold uppercase tracking-[.16em] text-amber-300">Koterie resources</p><h1 className="mt-3 text-4xl font-bold">Material library</h1><p className="mt-3 max-w-3xl text-white/45">Publish real resources for Academy, Studio or everyone. Uploaded files stay private and downloads use temporary links.</p></div>
    {notice&&<div className={`mt-5 rounded-xl border p-4 text-sm ${notice.includes('published')?'border-emerald-500/20 bg-emerald-500/10 text-emerald-200':'border-red-500/20 bg-red-500/10 text-red-200'}`}>{notice}</div>}

    <div className="mt-7 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
      <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
        <div className="grid grid-cols-2 gap-2 sm:flex"><button onClick={()=>setMode('link')} className={`rounded-xl px-4 py-2 text-sm font-bold ${mode==='link'?'bg-purple-600':'border border-white/10 bg-white/5 text-white/50'}`}><ExternalLink className="mr-2 inline h-4 w-4"/>Link</button><button onClick={()=>setMode('upload')} className={`rounded-xl px-4 py-2 text-sm font-bold ${mode==='upload'?'bg-purple-600':'border border-white/10 bg-white/5 text-white/50'}`}><Upload className="mr-2 inline h-4 w-4"/>Upload file</button></div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Material title" className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 outline-none"/>
          <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} placeholder="Short description (optional)" className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 outline-none"/>
          <div className="grid gap-3 sm:grid-cols-2"><select value={form.space} onChange={e=>setForm({...form,space:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3"><option value="all">Everyone</option><option value="academy">Academy</option><option value="studio">Studio only</option></select><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3">{categories.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div>
          {mode==='link'?<input required type="url" value={form.externalUrl} onChange={e=>setForm({...form,externalUrl:e.target.value})} placeholder="https://…" className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 outline-none"/>:<label className="block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-7 text-center hover:bg-white/[0.04]"><Upload className="mx-auto h-7 w-7 text-purple-300"/><p className="mt-3 font-semibold">{file?file.name:'Choose PDF, audio or image'}</p><p className="mt-1 text-xs text-white/30">Maximum 25 MB · PDF · MP3/M4A/WAV · JPG/PNG/WebP</p><input type="file" className="hidden" accept=".pdf,audio/*,image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>}
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-slate-950 disabled:opacity-40">{busy?<Loader2 className="h-4 w-4 animate-spin"/>:<BookOpen className="h-4 w-4"/>}Publish material</button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Published resources</h2><p className="mt-1 text-sm text-white/35">{activeCount} active</p></div></div>
        <div className="mt-5 space-y-3">{items.length===0?<div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-white/35">No material yet.</div>:items.map(item=><article key={item.id} className={`rounded-2xl border p-4 ${item.active?'border-white/[0.08] bg-white/[0.025]':'border-white/[0.05] bg-black/10 opacity-55'}`}><div className="flex flex-col gap-3 sm:flex-row sm:items-start"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300">{item.category==='audio'?<FileAudio className="h-5 w-5"/>:<FileText className="h-5 w-5"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold">{item.title}</p><span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-white/35">{item.space}</span></div><p className="mt-1 text-xs text-white/30">{item.source_type==='upload'?(item.file_name||'File'):'External link'}{item.file_size_bytes?` · ${fmtSize(Number(item.file_size_bytes))}`:''}</p></div><button onClick={async()=>{setBusy(true);try{await json('/api/admin/materials',{method:'PATCH',body:JSON.stringify({id:item.id,active:!item.active})});await load()}catch(e){setNotice(e instanceof Error?e.message:'Could not update')}finally{setBusy(false)}}} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 hover:text-white">{item.active?'Hide':'Restore'}</button></div></article>)}</div>
      </section>
    </div>
  </div></main>
}
