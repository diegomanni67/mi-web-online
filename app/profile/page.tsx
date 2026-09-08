"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Plus, Save, Sparkles, X } from 'lucide-react'

type Profile = {
  id: string; email: string; name: string; role: 'student'|'teacher'|'admin'; access: 'academy'|'studio';
  bio: string; goals: string[]; interests: string[]; conversationTopics: string[]; availability: string; avatarColor: string
}

const interestOptions = ['Movies & series','Music','Travel','Food','Gaming','Technology','Sports','Books','Work','Culture','Art','Current affairs']
const topicOptions = ['Daily life','Travel stories','Films & TV','Music','Work & careers','Technology & AI','Food','Sports','Culture','News','Books','Personal goals']
const colors: Record<string,string> = {
  violet:'from-violet-500 to-fuchsia-500', blue:'from-blue-500 to-cyan-400', pink:'from-pink-500 to-rose-400',
  emerald:'from-emerald-500 to-teal-400', amber:'from-amber-400 to-orange-500', cyan:'from-cyan-400 to-blue-500'
}

function TagPicker({ options, value, onChange }: { options:string[]; value:string[]; onChange:(next:string[])=>void }) {
  return <div className="flex flex-wrap gap-2">{options.map(option => {
    const selected=value.includes(option)
    return <button type="button" key={option} onClick={() => onChange(selected ? value.filter(item=>item!==option) : [...value, option])} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${selected ? 'border-purple-400/30 bg-purple-500/15 text-purple-200' : 'border-white/10 bg-white/[0.025] text-white/45 hover:text-white'}`}>{selected ? '✓ ' : '+ '}{option}</button>
  })}</div>
}

export default function ProfilePage() {
  const [profile,setProfile]=useState<Profile|null>(null)
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [message,setMessage]=useState('')
  const [goalInput,setGoalInput]=useState('')

  useEffect(()=>{
    fetch('/api/profile',{cache:'no-store'})
      .then(r=>r.ok?r.json():Promise.reject())
      .then(data=>setProfile(data.profile))
      .catch(()=>setMessage('No pudimos cargar tu perfil.'))
      .finally(()=>setLoading(false))
  },[])

  const initials=useMemo(()=>profile?.name?.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase()||'K',[profile?.name])

  function addGoal(){
    if(!profile) return
    const goal=goalInput.trim()
    if(!goal || profile.goals.some(item=>item.toLowerCase()===goal.toLowerCase()) || profile.goals.length>=8) return
    setProfile({...profile,goals:[...profile.goals,goal]});setGoalInput('')
  }

  async function save(){
    if(!profile||saving)return
    setSaving(true);setMessage('')
    try{
      const response=await fetch('/api/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(profile)})
      const data=await response.json()
      if(!response.ok) throw new Error(data.error||'Error')
      setProfile(data.profile);setMessage('Perfil guardado.')
    }catch(error:any){setMessage(error?.message||'No pudimos guardar tu perfil.')}
    finally{setSaving(false)}
  }

  if(loading) return <main className="min-h-screen bg-[#0a0f1e] px-4 py-16 text-center text-sm text-white/40">Loading profile…</main>
  if(!profile) return <main className="min-h-screen bg-[#0a0f1e] px-4 py-16 text-center text-white"><p>{message||'Profile unavailable.'}</p><Link href="/dashboard" className="mt-5 inline-block text-purple-300">Volver</Link></main>

  return <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 hover:text-white"><ArrowLeft className="h-4 w-4"/> Student area</Link>
      <div className="mt-7 grid gap-7 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-6 text-center lg:sticky lg:top-24 lg:self-start">
          <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br ${colors[profile.avatarColor]||colors.violet} text-3xl font-black shadow-2xl shadow-black/25`}>{initials}</div>
          <h1 className="mt-5 text-2xl font-bold">{profile.name}</h1>
          <p className="mt-1 text-sm text-white/35">{profile.email}</p>
          <div className="mt-4 flex justify-center gap-2"><span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] ${profile.access==='studio'?'bg-pink-500/10 text-pink-300':'bg-blue-500/10 text-blue-300'}`}>{profile.access}</span>{profile.role!=='student'&&<span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-amber-300">{profile.role}</span>}</div>
          <p className="mt-6 text-xs leading-5 text-white/30">Tu email no se muestra a otros alumnos. Academy/Studio y el rol los gestionan las profesoras.</p>
        </aside>

        <section className="space-y-5">
          <div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-purple-300"><Sparkles className="h-4 w-4"/> Mi perfil</div><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Make your profile useful for conversation.</h2><p className="mt-3 max-w-2xl leading-7 text-white/45">Elegí intereses y temas reales. Eso ayuda a encontrar personas con algo de qué hablar, sin convertir Koterie en una red social genérica.</p></div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7">
            <label className="text-sm font-semibold text-white/70">Nombre visible</label><input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} maxLength={80} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 outline-none focus:border-purple-400/35"/>
            <label className="mt-5 block text-sm font-semibold text-white/70">Sobre mí</label><textarea value={profile.bio} onChange={e=>setProfile({...profile,bio:e.target.value})} maxLength={500} rows={4} placeholder="A short introduction: what you do, why you're learning English, what you enjoy..." className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 leading-6 outline-none focus:border-purple-400/35"/><p className="mt-1 text-right text-[11px] text-white/20">{profile.bio.length}/500</p>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7"><h3 className="text-lg font-bold">Intereses</h3><p className="mt-1 mb-4 text-sm text-white/35">Se muestran en tu perfil y sirven para filtrar personas con gustos en común.</p><TagPicker options={interestOptions} value={profile.interests} onChange={interests=>setProfile({...profile,interests})}/></div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7"><h3 className="text-lg font-bold">Temas que me gusta conversar</h3><p className="mt-1 mb-4 text-sm text-white/35">No tiene que ser lo mismo que tus intereses.</p><TagPicker options={topicOptions} value={profile.conversationTopics} onChange={conversationTopics=>setProfile({...profile,conversationTopics})}/></div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 sm:p-7"><h3 className="text-lg font-bold">Objetivos</h3><p className="mt-1 text-sm text-white/35">Ejemplo: “Speak more confidently at work”.</p><div className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={goalInput} onChange={e=>setGoalInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addGoal()}}} placeholder="Add a goal…" maxLength={80} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm outline-none focus:border-purple-400/35"/><button type="button" onClick={addGoal} className="flex min-h-11 items-center justify-center rounded-xl bg-white/10 px-4 text-white hover:bg-white/15 sm:min-h-0"><Plus className="h-4 w-4"/></button></div><div className="mt-3 flex flex-wrap gap-2">{profile.goals.map(goal=><span key={goal} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-white/65">{goal}<button onClick={()=>setProfile({...profile,goals:profile.goals.filter(item=>item!==goal)})}><X className="h-3 w-3"/></button></span>)}</div></div>

          <div className="grid gap-5 md:grid-cols-2"><div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6"><h3 className="font-bold">Disponibilidad</h3><textarea value={profile.availability} onChange={e=>setProfile({...profile,availability:e.target.value})} maxLength={240} rows={4} placeholder="Example: Weekdays after 18:00, Saturday mornings…" className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm leading-6 outline-none focus:border-purple-400/35"/></div><div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6"><h3 className="font-bold">Color de avatar</h3><div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">{Object.keys(colors).map(color=><button key={color} aria-label={color} onClick={()=>setProfile({...profile,avatarColor:color})} className={`h-10 rounded-xl bg-gradient-to-br ${colors[color]} ${profile.avatarColor===color?'ring-2 ring-white ring-offset-2 ring-offset-[#0a0f1e]':''}`}/>)}</div><p className="mt-4 text-xs leading-5 text-white/30">Por ahora usamos avatar por iniciales para no depender de almacenamiento de fotos. Más adelante podemos sumar foto real.</p></div></div>

          {message&&<div className={`rounded-2xl border p-4 text-sm ${message.includes('guardado')?'border-emerald-500/20 bg-emerald-500/10 text-emerald-200':'border-amber-500/20 bg-amber-500/10 text-amber-100'}`}>{message}</div>}
          <div className="flex justify-stretch sm:justify-end"><button onClick={save} disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-3.5 font-bold transition hover:bg-purple-500 disabled:opacity-50 sm:w-auto">{saving?<><Save className="h-4 w-4"/> Saving…</>:<><Check className="h-4 w-4"/> Save profile</>}</button></div>
        </section>
      </div>
    </div>
  </main>
}
