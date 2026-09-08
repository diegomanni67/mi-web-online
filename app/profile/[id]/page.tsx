"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react'

type Member = { id:string; name:string; role:'student'|'teacher'|'admin'; access:'academy'|'studio'; bio:string; goals:string[]; interests:string[]; conversationTopics:string[]; availability:string; avatarColor:string; joinedAt:string|null }
const colors: Record<string,string>={violet:'from-violet-500 to-fuchsia-500',blue:'from-blue-500 to-cyan-400',pink:'from-pink-500 to-rose-400',emerald:'from-emerald-500 to-teal-400',amber:'from-amber-400 to-orange-500',cyan:'from-cyan-400 to-blue-500'}

export default function MemberProfilePage() {
  const params = useParams()
  const id = String(params?.id || '')
  const [member,setMember]=useState<Member|null>(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{
    if(!id)return
    fetch(`/api/community/members/${encodeURIComponent(id)}`,{cache:'no-store'})
      .then(r=>r.ok?r.json():Promise.reject())
      .then(data=>setMember(data.member))
      .catch(()=>setError('No pudimos cargar este perfil.'))
      .finally(()=>setLoading(false))
  },[id])

  if(loading) return <main className="min-h-screen bg-[#0a0f1e] px-4 py-16 text-center text-sm text-white/40">Loading member…</main>
  if(!member) return <main className="min-h-screen bg-[#0a0f1e] px-4 py-16 text-center text-white"><p>{error}</p><Link href="/community" className="mt-4 inline-block text-purple-300">Back to community</Link></main>
  const initials=member.name.split(/\s+/).map(part=>part[0]).join('').slice(0,2).toUpperCase()

  return <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-4xl"><Link href="/community" className="inline-flex items-center gap-2 text-sm font-semibold text-white/45 hover:text-white"><ArrowLeft className="h-4 w-4"/> Community</Link><section className="mt-8 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.025]"><div className="h-28 bg-gradient-to-r from-purple-900/60 via-slate-900 to-blue-900/40"/><div className="px-6 pb-8 sm:px-9"><div className={`-mt-14 flex h-28 w-28 items-center justify-center rounded-[2rem] border-4 border-[#0a0f1e] bg-gradient-to-br ${colors[member.avatarColor]||colors.violet} text-3xl font-black shadow-xl`}>{initials}</div><div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-bold">{member.name}</h1><span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] ${member.access==='studio'?'bg-pink-500/10 text-pink-300':'bg-blue-500/10 text-blue-300'}`}>{member.access}</span>{member.role!=='student'&&<span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-amber-300">{member.role}</span>}</div>{member.bio?<p className="mt-4 max-w-2xl text-base leading-7 text-white/55">{member.bio}</p>:<p className="mt-4 text-sm text-white/30">This member has not added an introduction yet.</p>}</div><Link href="/academy-forum" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:bg-white/10"><MessageCircle className="h-4 w-4"/> Start in the forum</Link></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2"><Block title="Interests" items={member.interests}/><Block title="Conversation topics" items={member.conversationTopics}/><Block title="Learning goals" items={member.goals}/><div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><div className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-purple-300"/> Availability</div><p className="mt-3 text-sm leading-6 text-white/45">{member.availability||'Not shared yet.'}</p></div></div>
      </div></section></div></main>
}

function Block({title,items}:{title:string;items:string[]}){return <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><h2 className="text-sm font-bold">{title}</h2>{items.length?<div className="mt-3 flex flex-wrap gap-2">{items.map(item=><span key={item} className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/60">{item}</span>)}</div>:<p className="mt-3 text-sm text-white/30">Nothing added yet.</p>}</div>}
