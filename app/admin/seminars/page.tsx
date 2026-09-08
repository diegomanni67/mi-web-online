"use client"

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Check, ExternalLink, FileText, GraduationCap, Headphones, Plus, Upload, Users, XCircle } from 'lucide-react'
import { useMember } from '@/components/member/useMember'

type Seminar = {
  id:number; title:string; description:string; level:string; starts_at:string; duration_minutes:number; price_ars:number|null;
  reservation_url:string|null; recording_url:string|null; status:string; teacher_name:string|null; capacity:number|null;
  registration_open:boolean; registration_note:string|null; meeting_url:string|null; recording_visibility:string;
  confirmed_count:number; pending_count:number; waitlist_count:number;
}
type Registration = { id:number; seminar_id:number; name:string; email:string; status:string; created_at:string }
type Resource = { id:number; seminar_id:number; title:string; description:string|null; kind:string; source_type:string; file_name:string|null; mime_type:string|null; file_size_bytes:number|null; visibility:string; active:boolean }

type ResourceForm = { title:string; description:string; kind:'preparation'|'handout'|'recording'|'link'; visibility:'public'|'registered'|'confirmed'; sourceType:'link'|'upload'; externalUrl:string }
const emptyResource = ():ResourceForm => ({ title:'', description:'', kind:'handout', visibility:'confirmed', sourceType:'link', externalUrl:'' })

function formatDate(value:string){ return new Intl.DateTimeFormat('es-AR',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Buenos_Aires'}).format(new Date(value)) }
function formatBytes(value:number|null){ if(!value)return ''; if(value<1024*1024)return `${Math.round(value/1024)} KB`; return `${(value/1024/1024).toFixed(1)} MB` }

export default function AdminSeminarsPage(){
  const {member,loading:memberLoading}=useMember()
  const [seminars,setSeminars]=useState<Seminar[]>([]),[registrations,setRegistrations]=useState<Registration[]>([]),[resources,setResources]=useState<Resource[]>([])
  const [selectedId,setSelectedId]=useState<number|null>(null),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false)
  const [resource,setResource]=useState<ResourceForm>(emptyResource()),[file,setFile]=useState<File|null>(null)
  const [settings,setSettings]=useState({registrationOpen:true,registrationNote:'',meetingUrl:'',recordingUrl:'',recordingVisibility:'hidden'})

  async function jsonFetch(url:string,options?:RequestInit){const r=await fetch(url,{cache:'no-store',...options,headers:{'Content-Type':'application/json',...(options?.headers||{})}});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not complete the action');return d}
  async function load(){const d=await jsonFetch('/api/admin/seminars');setSeminars(d.seminars||[]);setRegistrations(d.registrations||[]);const rid=selectedId||Number(d.seminars?.[0]?.id||0);if(rid){setSelectedId(rid);const rr=await jsonFetch(`/api/admin/seminars/resources?seminarId=${rid}`);setResources(rr.resources||[])}else setResources([])}
  useEffect(()=>{if(member?.role==='teacher'||member?.role==='admin')load().catch(()=>setNotice('Could not load seminar management.'))},[member])

  const selected=useMemo(()=>seminars.find(s=>Number(s.id)===selectedId)||null,[seminars,selectedId])
  const selectedRegistrations=registrations.filter(r=>Number(r.seminar_id)===selectedId)
  useEffect(()=>{if(selected)setSettings({registrationOpen:selected.registration_open!==false,registrationNote:selected.registration_note||'',meetingUrl:selected.meeting_url||'',recordingUrl:selected.recording_url||'',recordingVisibility:selected.recording_visibility||'hidden'})},[selectedId,seminars])

  async function choose(id:number){setSelectedId(id);setNotice('');try{const d=await jsonFetch(`/api/admin/seminars/resources?seminarId=${id}`);setResources(d.resources||[])}catch{setResources([]);setNotice('Could not load seminar resources.')}}
  async function action(run:()=>Promise<any>,success:string){setBusy(true);setNotice('');try{await run();setNotice(success);await load()}catch(e){setNotice(e instanceof Error?e.message:'Could not save changes.')}finally{setBusy(false)}}

  async function saveResource(e:FormEvent){e.preventDefault();if(!selectedId)return
    await action(async()=>{
      let payload:any={seminarId:selectedId,...resource}
      if(resource.sourceType==='upload'){
        if(!file)throw new Error('Choose a file first.')
        const meta=await jsonFetch('/api/admin/seminars/resources/upload-url',{method:'POST',body:JSON.stringify({seminarId:selectedId,fileName:file.name,mimeType:file.type,size:file.size})})
        const uploaded=await fetch(meta.uploadUrl,{method:'PUT',headers:{'Content-Type':file.type},body:file})
        if(!uploaded.ok)throw new Error('The file could not be uploaded.')
        payload={...payload,objectKey:meta.objectKey,fileName:file.name,mimeType:file.type,fileSizeBytes:file.size}
      }
      await jsonFetch('/api/admin/seminars/resources',{method:'POST',body:JSON.stringify(payload)})
      setResource(emptyResource());setFile(null)
    },'Seminar resource saved.')
  }

  if(memberLoading)return <main className="min-h-screen bg-[#080d19] p-10 text-center text-white/40">Loading…</main>
  if(!member||member.role==='student')return <main className="min-h-screen bg-[#080d19] p-10 text-center text-white">Teacher access required.</main>

  return <main className="min-h-screen bg-[#080d19] px-4 py-10 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 hover:text-white"><ArrowLeft className="h-4 w-4"/>Back to control room</Link>
    <div className="mt-7 border-b border-white/[.07] pb-7"><div className="text-xs font-bold uppercase tracking-[.16em] text-amber-300">Seminar operations</div><h1 className="mt-3 text-4xl font-bold">Registrations, access & resources.</h1><p className="mt-3 max-w-3xl text-white/45">Nothing appears as confirmed until a teacher publishes a real event. Recordings can stay private for confirmed attendees.</p></div>
    {notice&&<div className="mt-6 rounded-xl border border-white/10 bg-white/[.04] p-4 text-sm text-white/70">{notice}</div>}

    {seminars.length===0?<div className="mt-8 rounded-[2rem] border border-dashed border-amber-500/20 bg-amber-500/[.035] p-9"><CalendarDays className="h-8 w-8 text-amber-300"/><h2 className="mt-5 text-2xl font-bold">No seminar has been confirmed.</h2><p className="mt-3 max-w-2xl text-white/45">The Gothic Literature idea remains only “In planning”. Create the real seminar from the main teacher panel when date, price and teacher are decided.</p></div>:
    <div className="mt-8 grid gap-6 xl:grid-cols-[330px_1fr]">
      <aside className="grid gap-3 sm:grid-cols-2 xl:block xl:space-y-3">{seminars.map(s=><button key={s.id} onClick={()=>choose(Number(s.id))} className={`w-full rounded-2xl border p-4 text-left transition ${selectedId===Number(s.id)?'border-amber-400/30 bg-amber-400/[.08]':'border-white/[.07] bg-white/[.025] hover:bg-white/[.04]'}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-[.12em] text-amber-300">{s.status}</span><span className="text-xs text-white/30">{s.confirmed_count||0}{s.capacity?`/${s.capacity}`:''}</span></div><h3 className="mt-2 font-bold">{s.title}</h3><p className="mt-2 text-xs text-white/35">{formatDate(s.starts_at)}</p></button>)}</aside>
      {selected&&<div className="space-y-6">
        <section className="rounded-[2rem] border border-white/[.08] bg-white/[.025] p-6 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-amber-300"><GraduationCap className="h-4 w-4"/>{selected.level}</div><h2 className="mt-3 text-3xl font-bold">{selected.title}</h2><p className="mt-2 text-sm text-white/40">{formatDate(selected.starts_at)} · {selected.duration_minutes} min · {selected.teacher_name||'Teacher not set'}</p></div><select value={selected.status} onChange={e=>action(()=>jsonFetch('/api/admin/seminars',{method:'PATCH',body:JSON.stringify({id:selected.id,status:e.target.value})}),'Seminar status updated.')} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-2 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-white/[.035] p-4"><p className="text-2xl font-bold">{selected.confirmed_count||0}</p><p className="text-xs text-white/35">Confirmed</p></div><div className="rounded-xl bg-white/[.035] p-4"><p className="text-2xl font-bold">{selected.pending_count||0}</p><p className="text-xs text-white/35">Pending</p></div><div className="rounded-xl bg-white/[.035] p-4"><p className="text-2xl font-bold">{selected.waitlist_count||0}</p><p className="text-xs text-white/35">Waitlist</p></div></div>
        </section>

        <section className="rounded-[2rem] border border-white/[.08] bg-white/[.025] p-6 sm:p-7"><h2 className="text-xl font-bold">Private access</h2><p className="mt-2 text-sm text-white/40">Meeting links are only returned to confirmed attendees. A recording link can be restricted after the event.</p><div className="mt-5 grid gap-3"><input value={settings.meetingUrl} onChange={e=>setSettings({...settings,meetingUrl:e.target.value})} placeholder="Meet / Zoom URL" className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"/><input value={settings.recordingUrl} onChange={e=>setSettings({...settings,recordingUrl:e.target.value})} placeholder="Recording URL (optional)" className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"/><textarea value={settings.registrationNote} onChange={e=>setSettings({...settings,registrationNote:e.target.value})} placeholder="Registration note" rows={3} className="resize-none rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"/><div className="flex flex-wrap items-center gap-5"><label className="flex items-center gap-2 text-sm text-white/60"><input type="checkbox" checked={settings.registrationOpen} onChange={e=>setSettings({...settings,registrationOpen:e.target.checked})}/>Registration open</label><label className="text-sm text-white/50">Recording: <select value={settings.recordingVisibility} onChange={e=>setSettings({...settings,recordingVisibility:e.target.value})} className="ml-2 rounded-lg border border-white/10 bg-[#10172a] px-2 py-1.5"><option value="hidden">Hidden</option><option value="registered">Registered attendees</option></select></label></div><button disabled={busy} onClick={()=>action(()=>jsonFetch('/api/admin/seminars',{method:'PATCH',body:JSON.stringify({id:selected.id,...settings})}),'Seminar access updated.')} className="w-full rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-40 sm:w-fit">Save access</button></div></section>

        <section className="rounded-[2rem] border border-white/[.08] bg-white/[.025] p-6 sm:p-7"><div className="flex items-center gap-3"><Users className="h-5 w-5 text-blue-300"/><h2 className="text-xl font-bold">Registrations</h2></div>{selectedRegistrations.length===0?<p className="mt-5 text-sm text-white/35">No registrations yet.</p>:<div className="mt-5 space-y-2">{selectedRegistrations.map(r=><div key={r.id} className="flex flex-col gap-3 rounded-xl border border-white/[.06] bg-white/[.025] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{r.name}</p><p className="text-xs text-white/35">{r.email}</p></div><select value={r.status} onChange={e=>action(()=>jsonFetch('/api/admin/seminars',{method:'PATCH',body:JSON.stringify({registrationId:r.id,status:e.target.value})}),'Registration updated.')} className="rounded-lg border border-white/10 bg-[#10172a] px-2 py-1.5 text-xs"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="waitlist">Waitlist</option><option value="cancelled">Cancelled</option></select></div>)}</div>}</section>

        <section className="rounded-[2rem] border border-white/[.08] bg-white/[.025] p-6 sm:p-7"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-purple-300"/><h2 className="text-xl font-bold">Seminar resources & recordings</h2></div><p className="mt-2 text-sm text-white/40">Upload lightweight handouts/audio, or add a private link for a full video recording.</p>
          <form onSubmit={saveResource} className="mt-5 grid gap-3"><div className="grid gap-3 sm:grid-cols-2"><input required value={resource.title} onChange={e=>setResource({...resource,title:e.target.value})} placeholder="Resource title" className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"/><select value={resource.kind} onChange={e=>setResource({...resource,kind:e.target.value as any})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm"><option value="preparation">Preparation</option><option value="handout">Handout</option><option value="recording">Recording</option><option value="link">Useful link</option></select></div><textarea value={resource.description} onChange={e=>setResource({...resource,description:e.target.value})} rows={2} placeholder="Optional description" className="resize-none rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"/><div className="grid gap-3 sm:grid-cols-2"><select value={resource.visibility} onChange={e=>setResource({...resource,visibility:e.target.value as any})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm"><option value="confirmed">Confirmed attendees only</option><option value="registered">Anyone registered</option><option value="public">All Koterie members</option></select><select value={resource.sourceType} onChange={e=>{setResource({...resource,sourceType:e.target.value as any});setFile(null)}} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm"><option value="link">Link</option><option value="upload">Upload file</option></select></div>{resource.sourceType==='link'?<input required value={resource.externalUrl} onChange={e=>setResource({...resource,externalUrl:e.target.value})} placeholder="https://…" className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"/>:<label className="flex cursor-pointer flex-col items-start gap-2 rounded-xl border border-dashed border-purple-400/25 bg-purple-400/[.05] px-4 py-4 text-sm text-purple-100 sm:flex-row sm:items-center sm:gap-3"><Upload className="h-5 w-5"/><span>{file?`${file.name} · ${formatBytes(file.size)}`:'Choose PDF, audio or image · max 25 MB'}</span><input type="file" className="hidden" accept="application/pdf,audio/*,image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>}<button disabled={busy} className="w-full rounded-xl bg-purple-600 px-5 py-3 font-bold disabled:opacity-40 sm:w-fit"><Plus className="mr-2 inline h-4 w-4"/>Add resource</button></form>
          <div className="mt-7 space-y-2">{resources.length===0?<p className="text-sm text-white/35">No seminar-specific resources yet.</p>:resources.map(r=><div key={r.id} className={`flex flex-col gap-3 rounded-xl border border-white/[.06] p-4 sm:flex-row sm:items-center sm:justify-between ${r.active?'bg-white/[.025]':'bg-white/[.01] opacity-55'}`}><div className="flex items-start gap-3"><div className="mt-1 text-purple-300">{r.kind==='recording'?<Headphones className="h-4 w-4"/>:<FileText className="h-4 w-4"/>}</div><div><p className="font-semibold">{r.title}</p><p className="mt-1 text-xs text-white/35">{r.kind} · {r.visibility}{r.file_name?` · ${r.file_name}`:''}{r.file_size_bytes?` · ${formatBytes(Number(r.file_size_bytes))}`:''}</p></div></div><button onClick={()=>action(()=>jsonFetch('/api/admin/seminars/resources',{method:'PATCH',body:JSON.stringify({id:r.id,active:!r.active})}),r.active?'Resource hidden.':'Resource restored.')} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold">{r.active?<><XCircle className="mr-1 inline h-3.5 w-3.5"/>Hide</>:<><Check className="mr-1 inline h-3.5 w-3.5"/>Restore</>}</button></div>)}</div>
        </section>
      </div>}
    </div>}
  </div></main>
}
