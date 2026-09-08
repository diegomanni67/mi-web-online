"use client"

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ExternalLink,
  GraduationCap,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react'
import { useMember } from '@/components/member/useMember'

function today() { return new Date().toISOString().slice(0, 10) }
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

type MemberRow = {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin'
  access: 'academy' | 'studio'
  active: boolean
  notes: string
  joinedAt: string | null
  lastLoginAt: string | null
  groups: Array<{ id: number; title: string }>
}

type GroupRow = {
  id: number
  title: string
  modality: 'group' | 'individual'
  teacher_name: string
  weekday: number
  start_time: string
  duration_minutes: number
  meeting_url: string
  active: boolean
  members: number
  memberList: Array<{ id: string; name: string; email: string; access: string }>
}

type ActivityRow = { id: number; space: string; title: string; prompt: string; active_from: string; active_until: string | null }
type SeminarRow = { id: number; title: string; starts_at: string; status: string; price_ars: number | null; level: string }

type GroupForm = { id?: number; title: string; modality: 'group' | 'individual'; teacherName: string; weekday: string; startTime: string; durationMinutes: string; meetingUrl: string }

const emptyGroup = (): GroupForm => ({ title: '', modality: 'group', teacherName: '', weekday: '1', startTime: '18:00', durationMinutes: '60', meetingUrl: '' })

function niceDate(value: string | null) {
  if (!value) return 'Never'
  try { return new Intl.DateTimeFormat('es-AR', { dateStyle:'medium', timeStyle:'short' }).format(new Date(value)) } catch { return value }
}

export default function AdminPage() {
  const { member, loading: memberLoading } = useMember()
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [groups, setGroups] = useState<GroupRow[]>([])
  const [members, setMembers] = useState<MemberRow[]>([])
  const [activities, setActivities] = useState<ActivityRow[]>([])
  const [seminars, setSeminars] = useState<SeminarRow[]>([])
  const [search, setSearch] = useState('')
  const [activity, setActivity] = useState({ space: 'all', title: '', prompt: '', activeFrom: today(), activeUntil: '' })
  const [seminar, setSeminar] = useState({ title: '', description: '', level: 'B2-C2', teacherName: '', startsAt: '', durationMinutes: '90', priceArs: '', capacity: '', reservationUrl: '', publish: false })
  const [group, setGroup] = useState<GroupForm>(emptyGroup())
  const [student, setStudent] = useState({ name:'', email:'', access:'academy' as 'academy'|'studio', role:'student' as 'student'|'teacher'|'admin', notes:'' })
  const [editingMember, setEditingMember] = useState<MemberRow | null>(null)
  const [assignment, setAssignment] = useState({ groupId: '', profileId: '' })

  async function jsonFetch(url: string, options?: RequestInit) {
    const response = await fetch(url, { cache:'no-store', ...options, headers: { 'Content-Type':'application/json', ...(options?.headers || {}) } })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not complete the action')
    return data
  }

  async function refreshAll() {
    const [groupData, memberData, activityData, seminarData] = await Promise.all([
      jsonFetch('/api/admin/groups'),
      jsonFetch('/api/admin/members'),
      jsonFetch('/api/admin/activities'),
      jsonFetch('/api/admin/seminars'),
    ])
    setGroups(groupData.groups || [])
    setMembers(memberData.members || [])
    setActivities(activityData.activities || [])
    setSeminars(seminarData.seminars || [])
  }

  useEffect(() => {
    if (member?.role === 'teacher' || member?.role === 'admin') {
      setGroup((current) => current.teacherName ? current : { ...current, teacherName: member.name })
      refreshAll().catch(() => setNotice('Could not load the control room data.'))
    }
  }, [member])

  const filteredMembers = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return members
    return members.filter((item) => `${item.name} ${item.email} ${item.access} ${item.role}`.toLowerCase().includes(needle))
  }, [members, search])

  const activeStudents = members.filter((item) => item.role === 'student' && item.active)
  const activeGroups = groups.filter((item) => item.active)
  const publishedSeminars = seminars.filter((item) => item.status === 'published')

  async function act(run: () => Promise<unknown>, success: string) {
    setBusy(true); setNotice('')
    try { await run(); setNotice(success); await refreshAll() }
    catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save changes') }
    finally { setBusy(false) }
  }

  if (memberLoading) return <main className="min-h-screen bg-[#080d19] p-10 text-center text-white/40">Loading…</main>
  if (!member || member.role === 'student') return <main className="min-h-screen bg-[#080d19] p-10 text-center text-white"><p>Teacher access required.</p><Link href="/dashboard" className="mt-5 inline-block text-purple-300">Back to dashboard</Link></main>

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 hover:text-white"><ArrowLeft className="h-4 w-4" /> Student area</Link>
        <div className="mt-7 flex flex-col gap-5 border-b border-white/[0.07] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-300"><Sparkles className="h-4 w-4" /> Teacher control room</div>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Run Koterie without editing code.</h1>
            <p className="mt-3 max-w-3xl text-white/45">Students, groups, weekly activities and seminars from one place.</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap"><Link href="/admin/materials" className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-sm font-semibold text-amber-200 hover:bg-amber-400/15">Manage material</Link><Link href="/admin/seminars" className="rounded-xl border border-purple-400/20 bg-purple-400/10 px-4 py-2.5 text-sm font-semibold text-purple-200 hover:bg-purple-400/15">Manage seminars</Link><button onClick={() => refreshAll().catch(() => setNotice('Could not refresh.'))} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/65 hover:bg-white/10 hover:text-white">Refresh data</button></div>
        </div>

        {notice && <div className={`mt-6 rounded-xl border p-4 text-sm ${notice.toLowerCase().includes('could') || notice.toLowerCase().includes('error') || notice.toLowerCase().includes('required') ? 'border-red-500/20 bg-red-500/10 text-red-200' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'}`}>{notice}</div>}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active students', String(activeStudents.length), Users],
            ['Active classes', String(activeGroups.length), CalendarDays],
            ['Studio students', String(activeStudents.filter((item) => item.access === 'studio').length), GraduationCap],
            ['Published seminars', String(publishedSeminars.length), Sparkles],
          ].map(([label,value,Icon]: any) => <article key={label} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><Icon className="h-5 w-5 text-purple-300"/><p className="mt-4 text-3xl font-bold">{value}</p><p className="mt-1 text-sm text-white/40">{label}</p></article>)}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div><div className="flex items-center gap-3"><Users className="h-5 w-5 text-blue-300"/><h2 className="text-2xl font-bold">Students & access</h2></div><p className="mt-2 text-sm text-white/40">Create a student before their first login, choose Academy or Studio and keep private teacher notes.</p></div>
            <div className="relative w-full lg:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search name or email" className="w-full rounded-xl border border-white/10 bg-[#10172a] py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-400/30"/></div>
          </div>

          <form className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1.2fr_.6fr_.6fr_1.2fr_auto]" onSubmit={(e:FormEvent)=>{e.preventDefault();act(async()=>{await jsonFetch('/api/admin/members',{method:'POST',body:JSON.stringify(student)});setStudent({name:'',email:'',access:'academy',role:'student',notes:''})},'Student saved.')}}>
            <input required value={student.name} onChange={(e)=>setStudent({...student,name:e.target.value})} placeholder="Student name" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm outline-none"/>
            <input required type="email" value={student.email} onChange={(e)=>setStudent({...student,email:e.target.value})} placeholder="student@email.com" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm outline-none"/>
            <select value={student.access} onChange={(e)=>setStudent({...student,access:e.target.value as any})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm"><option value="academy">Academy</option><option value="studio">Studio</option></select>
            {member.role === 'admin' ? <select value={student.role} onChange={(e)=>setStudent({...student,role:e.target.value as any})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm"><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option></select> : <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.025] px-3 text-sm text-white/35">Student</div>}
            <input value={student.notes} onChange={(e)=>setStudent({...student,notes:e.target.value})} placeholder="Private note (optional)" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm outline-none"/>
            <button disabled={busy} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold disabled:opacity-40 sm:col-span-2 lg:col-span-1"><Plus className="h-4 w-4"/> Add</button>
          </form>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07]">
            <div className="hidden grid-cols-[1.2fr_1.35fr_.55fr_.55fr_.9fr_auto] gap-3 bg-white/[0.035] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white/30 md:grid"><span>Name</span><span>Email</span><span>Space</span><span>Status</span><span>Class</span><span></span></div>
            <div className="divide-y divide-white/[0.06]">
              {filteredMembers.map((item) => (
                <div key={item.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1.2fr_1.35fr_.55fr_.55fr_.9fr_auto] md:items-center">
                  <div><p className="font-semibold">{item.name}</p><p className="mt-1 text-xs text-white/30">{item.role}{item.lastLoginAt ? ` · last login ${niceDate(item.lastLoginAt)}` : ' · not logged in yet'}</p></div>
                  <p className="break-all text-sm text-white/50">{item.email}</p>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${item.access==='studio'?'bg-pink-500/12 text-pink-300':'bg-blue-500/12 text-blue-300'}`}>{item.access}</span>
                  <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${item.active?'bg-emerald-500/12 text-emerald-300':'bg-red-500/12 text-red-300'}`}>{item.active?'active':'inactive'}</span>
                  <p className="text-xs leading-5 text-white/40">{item.groups.length ? item.groups.map((g)=>g.title).join(', ') : 'No class yet'}</p>
                  <button onClick={()=>setEditingMember(item)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/65 hover:bg-white/10">Edit</button>
                </div>
              ))}
              {!filteredMembers.length && <div className="p-8 text-center text-sm text-white/35">No members match this search.</div>}
            </div>
          </div>

          {editingMember && (
            <div className="mt-6 rounded-2xl border border-purple-400/15 bg-purple-500/[0.05] p-5">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-purple-300">Edit member</p><h3 className="mt-1 text-xl font-bold">{editingMember.name}</h3></div><button onClick={()=>setEditingMember(null)} className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"><X className="h-4 w-4"/></button></div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                <input value={editingMember.name} onChange={(e)=>setEditingMember({...editingMember,name:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"/>
                <select value={editingMember.access} onChange={(e)=>setEditingMember({...editingMember,access:e.target.value as any})} className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"><option value="academy">Academy</option><option value="studio">Studio</option></select>
                {member.role==='admin' ? <select value={editingMember.role} onChange={(e)=>setEditingMember({...editingMember,role:e.target.value as any})} className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option></select> : <div className="flex items-center rounded-xl border border-white/10 bg-[#10172a] px-4 text-sm text-white/40">{editingMember.role}</div>}
                <select value={editingMember.active?'active':'inactive'} onChange={(e)=>setEditingMember({...editingMember,active:e.target.value==='active'})} className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"><option value="active">Active</option><option value="inactive">Inactive</option></select>
                <button disabled={busy} onClick={()=>act(async()=>{await jsonFetch('/api/admin/members',{method:'PATCH',body:JSON.stringify(editingMember)});setEditingMember(null)},'Member updated.')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold disabled:opacity-40"><Check className="h-4 w-4"/> Save</button>
              </div>
              <textarea value={editingMember.notes} onChange={(e)=>setEditingMember({...editingMember,notes:e.target.value})} rows={3} placeholder="Private notes for teachers" className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"/>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
          <div className="flex items-center gap-3"><CalendarDays className="h-5 w-5 text-blue-300"/><h2 className="text-2xl font-bold">Classes & groups</h2></div>
          <p className="mt-2 text-sm text-white/40">Create or edit schedules, pause a class, add students and remove them without deleting their account.</p>

          <form className="mt-6 grid gap-3 lg:grid-cols-6" onSubmit={(e:FormEvent)=>{e.preventDefault();act(async()=>{await jsonFetch('/api/admin/groups',{method:group.id?'PATCH':'POST',body:JSON.stringify({...group,weekday:Number(group.weekday),durationMinutes:Number(group.durationMinutes)})});setGroup({...emptyGroup(),teacherName:member.name})},group.id?'Class updated.':'Class created.')}}>
            <input required value={group.title} onChange={(e)=>setGroup({...group,title:e.target.value})} placeholder="Class / group name" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm"/>
            <input required value={group.teacherName} onChange={(e)=>setGroup({...group,teacherName:e.target.value})} placeholder="Teacher" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm"/>
            <select value={group.weekday} onChange={(e)=>setGroup({...group,weekday:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm">{weekdays.map((day,index)=><option key={day} value={index}>{day}</option>)}</select>
            <input type="time" value={group.startTime} onChange={(e)=>setGroup({...group,startTime:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm"/>
            <select value={group.modality} onChange={(e)=>setGroup({...group,modality:e.target.value as any})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm"><option value="group">Group</option><option value="individual">Individual</option></select>
            <button disabled={busy} className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold disabled:opacity-40">{group.id?'Save class':'Create class'}</button>
            <input value={group.meetingUrl} onChange={(e)=>setGroup({...group,meetingUrl:e.target.value})} placeholder="Meet / Zoom link (optional)" className="lg:col-span-4 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm"/>
            <select value={group.durationMinutes} onChange={(e)=>setGroup({...group,durationMinutes:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3 text-sm"><option value="60">60 min</option><option value="90">90 min</option><option value="120">120 min</option></select>
            {group.id && <button type="button" onClick={()=>setGroup({...emptyGroup(),teacherName:member.name})} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/55">Cancel edit</button>}
          </form>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {groups.map((g)=><article key={g.id} className={`rounded-2xl border p-5 ${g.active?'border-white/[0.08] bg-white/[0.025]':'border-red-500/10 bg-red-500/[0.025] opacity-75'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xl font-bold">{g.title}</h3><span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold uppercase text-white/40">{g.modality}</span>{!g.active&&<span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase text-red-300">paused</span>}</div><p className="mt-2 text-sm text-white/45">{weekdays[g.weekday]} · {g.start_time} · {g.duration_minutes} min · {g.teacher_name}</p></div><div className="flex gap-2"><button onClick={()=>setGroup({id:g.id,title:g.title,modality:g.modality,teacherName:g.teacher_name,weekday:String(g.weekday),startTime:g.start_time,durationMinutes:String(g.duration_minutes),meetingUrl:g.meeting_url||''})} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold">Edit</button><button onClick={()=>act(()=>jsonFetch('/api/admin/groups',{method:'PATCH',body:JSON.stringify({id:g.id,action:'set-active',active:!g.active})}),g.active?'Class paused.':'Class activated.')} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold">{g.active?'Pause':'Activate'}</button></div></div>
              {g.meeting_url && <a href={g.meeting_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white">Open meeting link <ExternalLink className="h-3.5 w-3.5"/></a>}
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/10 p-3"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-white/30">Students ({g.memberList.length})</p></div><div className="mt-2 flex flex-wrap gap-2">{g.memberList.map((m)=><span key={m.id} className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-xs"><span>{m.name}</span><button title="Remove from class" onClick={()=>act(()=>jsonFetch('/api/admin/groups/assign',{method:'DELETE',body:JSON.stringify({groupId:g.id,profileId:m.id})}),'Student removed from class.')} className="text-white/30 hover:text-red-300"><X className="h-3 w-3"/></button></span>)}{!g.memberList.length&&<span className="text-xs text-white/25">No students assigned yet.</span>}</div></div>
            </article>)}
          </div>

          <form className="mt-5 grid gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 md:grid-cols-[1fr_1.2fr_auto]" onSubmit={(e:FormEvent)=>{e.preventDefault();act(async()=>{await jsonFetch('/api/admin/groups/assign',{method:'POST',body:JSON.stringify(assignment)});setAssignment({...assignment,profileId:''})},'Student assigned to class.')}}>
            <select required value={assignment.groupId} onChange={(e)=>setAssignment({...assignment,groupId:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"><option value="">Choose active class</option>{activeGroups.map(g=><option key={g.id} value={g.id}>{g.title} · {weekdays[g.weekday]} {g.start_time}</option>)}</select>
            <select required value={assignment.profileId} onChange={(e)=>setAssignment({...assignment,profileId:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-4 py-3 text-sm"><option value="">Choose student</option>{activeStudents.map(s=><option key={s.id} value={s.id}>{s.name} · {s.email} · {s.access}</option>)}</select>
            <button disabled={busy} className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-40">Assign student</button>
          </form>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
            <div className="flex items-center gap-3"><Settings className="h-5 w-5 text-purple-300"/><h2 className="text-2xl font-bold">Weekly activities</h2></div>
            <form className="mt-5 space-y-3" onSubmit={(e:FormEvent)=>{e.preventDefault();act(async()=>{await jsonFetch('/api/admin/activities',{method:'POST',body:JSON.stringify(activity)});setActivity({...activity,title:'',prompt:''})},'Weekly activity saved.')}}>
              <select value={activity.space} onChange={(e)=>setActivity({...activity,space:e.target.value})} className="w-full rounded-xl border border-white/10 bg-[#10172a] px-4 py-3"><option value="all">Academy + Studio</option><option value="academy">Academy</option><option value="studio">Studio</option></select>
              <input required value={activity.title} onChange={(e)=>setActivity({...activity,title:e.target.value})} placeholder="Activity title" className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3"/>
              <textarea required value={activity.prompt} onChange={(e)=>setActivity({...activity,prompt:e.target.value})} rows={4} placeholder="Prompt / instructions" className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3"/>
              <div className="grid grid-cols-2 gap-3"><input type="date" value={activity.activeFrom} onChange={(e)=>setActivity({...activity,activeFrom:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3"/><input type="date" value={activity.activeUntil} onChange={(e)=>setActivity({...activity,activeUntil:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3"/></div>
              <button disabled={busy} className="rounded-xl bg-purple-600 px-5 py-3 font-bold disabled:opacity-40">Publish activity</button>
            </form>
            <div className="mt-5 space-y-2">{activities.slice(0,6).map((a)=><div key={a.id} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{a.title}</p><p className="mt-1 text-xs text-white/35">{a.space} · from {String(a.active_from).slice(0,10)}{a.active_until?` to ${String(a.active_until).slice(0,10)}`:' · no end date'}</p></div><button onClick={()=>act(()=>jsonFetch('/api/admin/activities',{method:'PATCH',body:JSON.stringify({id:a.id,action:'end'})}),'Activity ended today.')} className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/50 hover:text-white">End</button></div></div>)}</div>
          </section>

          <section className="rounded-[2rem] border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
            <div className="flex items-center gap-3"><GraduationCap className="h-5 w-5 text-amber-300"/><h2 className="text-2xl font-bold">Seminars</h2></div>
            <form className="mt-5 space-y-3" onSubmit={(e:FormEvent)=>{e.preventDefault();act(async()=>{await jsonFetch('/api/admin/seminars',{method:'POST',body:JSON.stringify({...seminar,durationMinutes:Number(seminar.durationMinutes)})});setSeminar({...seminar,title:'',description:'',teacherName:'',startsAt:'',priceArs:'',capacity:'',reservationUrl:'',publish:false})},seminar.publish?'Seminar published.':'Seminar saved as draft.')}}>
              <input required value={seminar.title} onChange={(e)=>setSeminar({...seminar,title:e.target.value})} placeholder="Seminar title" className="w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3"/>
              <textarea required value={seminar.description} onChange={(e)=>setSeminar({...seminar,description:e.target.value})} rows={4} placeholder="What will people discuss or learn?" className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3"/>
              <div className="grid gap-3 sm:grid-cols-2"><input value={seminar.teacherName} onChange={(e)=>setSeminar({...seminar,teacherName:e.target.value})} placeholder="Teacher name" className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3"/><input value={seminar.level} onChange={(e)=>setSeminar({...seminar,level:e.target.value})} placeholder="Level (e.g. B2-C2)" className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3"/></div>
              <div className="grid gap-3 sm:grid-cols-2"><input required type="datetime-local" value={seminar.startsAt} onChange={(e)=>setSeminar({...seminar,startsAt:e.target.value})} className="rounded-xl border border-white/10 bg-[#10172a] px-3 py-3"/><input value={seminar.priceArs} onChange={(e)=>setSeminar({...seminar,priceArs:e.target.value})} inputMode="numeric" placeholder="Price ARS (optional)" className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3"/></div>
              <div className="grid gap-3 sm:grid-cols-2"><input value={seminar.capacity} onChange={(e)=>setSeminar({...seminar,capacity:e.target.value})} inputMode="numeric" placeholder="Capacity (optional)" className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3"/><input value={seminar.reservationUrl} onChange={(e)=>setSeminar({...seminar,reservationUrl:e.target.value})} placeholder="Reservation URL (optional)" className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3"/></div>
              <label className="flex items-center gap-2 text-sm text-white/55"><input type="checkbox" checked={seminar.publish} onChange={(e)=>setSeminar({...seminar,publish:e.target.checked})}/> Publish immediately <span className="text-white/25">(leave off until date, price and teacher are confirmed)</span></label>
              <div className="flex flex-wrap gap-3"><button disabled={busy} className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-40">Save seminar</button><Link href="/admin/seminars" className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white/70">Registrations & resources</Link></div>
            </form>
            <div className="mt-5 space-y-2">{seminars.slice(0,6).map((s)=><div key={s.id} className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{s.title}</p><p className="mt-1 text-xs text-white/35">{niceDate(s.starts_at)} · {s.status}{s.price_ars!==null?` · $${Number(s.price_ars).toLocaleString('es-AR')}`:''}</p></div><select value={s.status} onChange={(e)=>act(()=>jsonFetch('/api/admin/seminars',{method:'PATCH',body:JSON.stringify({id:s.id,status:e.target.value})}),'Seminar status updated.')} className="rounded-lg border border-white/10 bg-[#10172a] px-2 py-1.5 text-xs"><option value="draft">Draft</option><option value="published">Published</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div></div>)}</div>
          </section>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 text-sm leading-6 text-white/38">
          <div className="flex items-center gap-2 font-semibold text-white/60"><User className="h-4 w-4"/> Access model</div>
          <p className="mt-2">Students can now be created before their first login. Their email, Academy/Studio level and class assignment are already waiting for them when they enter with the matching access code. Teacher notes stay inside this control room.</p>
        </div>
      </div>
    </main>
  )
}
