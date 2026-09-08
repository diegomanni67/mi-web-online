"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Bot, CalendarDays, Download, FileText, GraduationCap, Loader2, MessageCircle, Mic2, Rocket, Sparkles, UserRound, Users } from 'lucide-react'

const whatsapp = 'https://wa.me/5491162991211?text=Hola%20Ana%20Laura%2C%20soy%20alumno%2Fa%20de%20Koterie%20y%20quiero%20consultar%20por%20mi%20pr%C3%B3xima%20clase.'
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

type Overview = {
  member: { name: string; access: 'academy' | 'studio'; role: 'student' | 'teacher' | 'admin' }
  profile: { completion:number; avatarColor:string }
  groups: Array<{ id: number; title: string; modality: string; teacher_name: string; weekday: number; start_time: string; duration_minutes: number; meeting_url?: string | null }>
  activities: Array<{ id: string | number; title: string; prompt: string; activity_type?: string }>
  upcomingSeminars:Array<{id:number;title:string;starts_at:string;duration_minutes:number;price_ars:number|null;level:string;teacher_name:string|null;capacity:number|null}>
  nextSeminar: { id: number; title: string; starts_at: string; duration_minutes: number; price_ars: number | null } | null
  seminarRegistrations:Array<{registration_id:number;registration_status:string;id:number;title:string;starts_at:string;duration_minutes:number;price_ars:number|null;level:string;teacher_name:string|null;seminar_status:string;meeting_url:string|null;recording_url:string|null;resource_count:number}>
  recentMaterials:Array<{id:number;title:string;description:string|null;category:string;source_type:string;file_name:string|null;mime_type:string|null;created_at:string}>
  plannedSeminarIdea:{id:number;title:string;description:string;level:string;label:string}|null
}

const fallbackActivity = { id: 'local', title: 'Keep English moving', prompt: 'Tell someone about one thing that happened this week and ask them a follow-up question.' }
const registrationLabel:Record<string,string>={pending:'Awaiting confirmation',confirmed:'Confirmed',waitlist:'Waiting list',cancelled:'Cancelled'}

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [materialError, setMaterialError] = useState('')

  async function loadOverview() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/dashboard/overview', { cache: 'no-store' })
      if (response.status === 401 || response.status === 403) {
        window.location.href = '/login?next=/dashboard'
        return
      }
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No pudimos cargar tu información.')
      setOverview(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No pudimos cargar tu información.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadOverview() }, [])

  const activity = overview?.activities?.[0] || fallbackActivity
  const group = overview?.groups?.[0] || null
  const seminarRegistration = overview?.seminarRegistrations?.find(item=>item.registration_status!=='cancelled') || null
  const classLabel = useMemo(() => {
    if (!group) return null
    const time = group.start_time?.slice(0,5) || ''
    return `${days[group.weekday] || ''} · ${time} · ${group.duration_minutes} min`
  }, [group])
  const seminarDate = (iso?:string|null) => iso ? new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Buenos_Aires' }).format(new Date(iso)) : null

  async function openMaterial(id:number) {
    setMaterialError('')
    try {
      const response = await fetch(`/api/materials/${id}/download`, { cache:'no-store' })
      const data = await response.json()
      if (!response.ok || !data.url) throw new Error(data.error || 'No pudimos abrir este material.')
      window.open(data.url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setMaterialError(err instanceof Error ? err.message : 'No pudimos abrir este material.')
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex min-h-[55vh] flex-col items-center justify-center rounded-[2rem] border border-white/[0.07] bg-white/[0.025]"><Loader2 className="h-7 w-7 animate-spin text-purple-300"/><p className="mt-4 text-sm font-semibold text-white/45">Preparando tu Koterie…</p></div></div></main>
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-purple-300"><Sparkles className="h-4 w-4" /> Student area</div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{overview?.member?.name ? `Hi, ${overview.member.name}.` : 'Welcome to Koterie.'}</h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-white/50">Your live classes are the anchor. Everything here is selected from your real Koterie access, class, activity and profile.</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-3 sm:flex sm:w-auto sm:flex-wrap">
            {(overview?.member?.role === 'teacher' || overview?.member?.role === 'admin') && <Link href="/admin" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-purple-100"><Users className="h-4 w-4" /> Teacher controls</Link>}
            <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold transition hover:bg-white/10"><MessageCircle className="h-4 w-4" /> Ask Ana Laura</a>
          </div>
        </div>

        {error && <div className="mt-6 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100 sm:flex-row sm:items-center sm:justify-between"><span>{error}</span><button onClick={()=>void loadOverview()} className="shrink-0 rounded-lg border border-red-300/20 bg-white/5 px-3 py-2 font-bold hover:bg-white/10">Reintentar</button></div>}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5"><p className="text-xs font-bold uppercase tracking-[.12em] text-white/30">Your space</p><p className="mt-3 text-2xl font-bold capitalize">{overview?.member?.access||'—'}</p></article>
          <article className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5"><p className="text-xs font-bold uppercase tracking-[.12em] text-white/30">Profile</p><p className="mt-3 text-2xl font-bold">{overview?.profile?.completion??0}%</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-cyan-400" style={{width:`${overview?.profile?.completion??0}%`}}/></div></article>
          <article className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5"><p className="text-xs font-bold uppercase tracking-[.12em] text-white/30">Your classes</p><p className="mt-3 text-2xl font-bold">{overview?.groups?.length??0}</p><p className="mt-1 text-xs text-white/35">active assignment{overview?.groups?.length===1?'':'s'}</p></article>
          <article className="rounded-2xl border border-white/[.07] bg-white/[.025] p-5"><p className="text-xs font-bold uppercase tracking-[.12em] text-white/30">Material</p><p className="mt-3 text-2xl font-bold">{overview?.recentMaterials?.length??0}</p><p className="mt-1 text-xs text-white/35">recent resources</p></article>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
          <article className="rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-purple-950/60 via-slate-950 to-slate-950 p-7 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">This week's mission</p><h2 className="mt-3 text-3xl font-bold">{activity.title}</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">{activity.prompt}</p></div><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300"><Mic2 className="h-7 w-7" /></div></div>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap"><Link href="/practice" className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold transition hover:bg-purple-500">Practice <ArrowRight className="h-4 w-4" /></Link><Link href="/academy-forum" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold transition hover:bg-white/10">Share in Academy</Link></div>
          </article>

          <article className="rounded-[2rem] border border-white/[0.08] bg-white/[0.03] p-7">
            <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300"><CalendarDays className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/30">Your class</p><h2 className="mt-1 text-xl font-bold">{group?.title || 'Schedule not assigned yet'}</h2></div></div>
            {group ? <><p className="mt-5 font-semibold text-blue-200">{classLabel}</p><p className="mt-2 text-sm leading-6 text-white/45">Teacher: {group.teacher_name} · {group.modality === 'individual' ? 'Individual' : 'Group'} class</p>{group.meeting_url ? <a href={group.meeting_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold">Open class link <ArrowRight className="h-4 w-4" /></a> : <p className="mt-5 text-xs text-white/30">The meeting link has not been added yet.</p>}</> : <><p className="mt-5 leading-7 text-white/48">Once Ana Laura or Cintia assigns your real group, this card will update automatically.</p><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-300">Check my schedule <ArrowRight className="h-4 w-4" /></a></>}
          </article>
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <Link href="/academy-forum" className="group rounded-3xl border border-blue-500/15 bg-blue-500/[0.045] p-6 transition hover:-translate-y-1 hover:border-blue-400/30"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300"><GraduationCap className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-bold">Academy</h3><p className="mt-2 text-sm leading-6 text-white/45">Practice, questions and community.</p></Link>
          <Link href="/studio-forum" className="group rounded-3xl border border-pink-500/15 bg-pink-500/[0.045] p-6 transition hover:-translate-y-1 hover:border-pink-400/30"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/15 text-pink-300"><Rocket className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-bold">Studio</h3><p className="mt-2 text-sm leading-6 text-white/45">Advanced conversation. Academy members can read; Studio members can participate.</p></Link>
          <Link href="/practice" className="group rounded-3xl border border-purple-500/15 bg-purple-500/[0.045] p-6 transition hover:-translate-y-1 hover:border-purple-400/30"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300"><Bot className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-bold">Practice Lab</h3><p className="mt-2 text-sm leading-6 text-white/45">Speaking, listening and guided practice between classes.</p></Link>
          <Link href="/community" className="group rounded-3xl border border-emerald-500/15 bg-emerald-500/[0.04] p-6 transition hover:-translate-y-1 hover:border-emerald-400/30"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300"><Users className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-bold">Community</h3><p className="mt-2 text-sm leading-6 text-white/45">Find people through real interests and topics.</p></Link>
          <Link href="/profile" className="group rounded-3xl border border-cyan-500/15 bg-cyan-500/[0.04] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300"><UserRound className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-bold">My profile</h3><p className="mt-2 text-sm leading-6 text-white/45">Goals, interests and conversation topics.</p></Link>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-amber-500/15 bg-amber-500/[0.035] p-7 sm:p-8"><div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-amber-300"/><h2 className="text-xl font-bold">Your seminar status</h2></div>{seminarRegistration?<><div className="mt-5 flex flex-wrap items-center gap-2"><span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-amber-200">{registrationLabel[seminarRegistration.registration_status]||seminarRegistration.registration_status}</span>{Number(seminarRegistration.resource_count)>0&&<span className="text-xs text-white/35">{seminarRegistration.resource_count} resource{Number(seminarRegistration.resource_count)===1?'':'s'} available</span>}</div><h3 className="mt-4 text-2xl font-bold">{seminarRegistration.title}</h3><p className="mt-2 text-sm text-white/45">{seminarDate(seminarRegistration.starts_at)} · {seminarRegistration.duration_minutes} min</p><div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">{seminarRegistration.meeting_url&&<a href={seminarRegistration.meeting_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950">Open seminar room <ArrowRight className="h-4 w-4"/></a>}{seminarRegistration.recording_url&&<a href={seminarRegistration.recording_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-400/20 bg-purple-400/10 px-5 py-3 font-bold text-purple-200">Watch recording</a>}</div></>:<><h3 className="mt-5 text-2xl font-bold">No seminar registration yet</h3><p className="mt-2 text-sm leading-6 text-white/45">There is currently no confirmed event. Planned ideas are kept separate so nothing looks more certain than it is.</p></>}<Link href="/seminars" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-300">View seminars <ArrowRight className="h-4 w-4"/></Link></article>

          <article className="rounded-[2rem] border border-purple-500/15 bg-purple-500/[0.035] p-7 sm:p-8"><div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-purple-300"/><h2 className="text-xl font-bold">On the horizon</h2></div>{overview?.plannedSeminarIdea?<><span className="mt-5 inline-flex rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-purple-200">{overview.plannedSeminarIdea.label}</span><h3 className="mt-4 text-2xl font-bold">{overview.plannedSeminarIdea.title}</h3><p className="mt-3 text-sm leading-6 text-white/45">{overview.plannedSeminarIdea.description}</p><p className="mt-4 text-xs font-bold text-purple-300">Suggested level: {overview.plannedSeminarIdea.level}</p></>:<p className="mt-5 text-sm text-white/40">No future seminar idea is currently highlighted.</p>}</article>
        </section>

        <section className="mt-5 rounded-[2rem] border border-white/[.08] bg-white/[.025] p-7 sm:p-8">{materialError&&<div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">{materialError}</div>}<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-cyan-300"/><h2 className="text-xl font-bold">Recent material for you</h2></div><p className="mt-2 text-sm text-white/40">Only resources available to your Academy/Studio access appear here.</p></div><Link href={overview?.member?.access==='studio'?'/studio-forum':'/academy-forum'} className="text-sm font-bold text-cyan-300">Open your space →</Link></div>{overview?.recentMaterials?.length?<div className="mt-5 grid gap-3 md:grid-cols-3">{overview.recentMaterials.map(item=><button key={item.id} onClick={()=>openMaterial(item.id)} className="rounded-2xl border border-white/[.07] bg-white/[.03] p-5 text-left transition hover:bg-white/[.05]"><p className="text-xs font-bold uppercase tracking-[.12em] text-cyan-300">{item.category.replace('-',' ')}</p><h3 className="mt-3 font-bold">{item.title}</h3>{item.description&&<p className="mt-2 line-clamp-2 text-sm leading-6 text-white/40">{item.description}</p>}<span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300">Open <Download className="h-3.5 w-3.5"/></span></button>)}</div>:<div className="mt-5 rounded-xl border border-dashed border-white/10 p-5 text-sm text-white/35 sm:p-6">No teacher material has been published for your space yet.</div>}</section>
      </div>
    </main>
  )
}
