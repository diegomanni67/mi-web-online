"use client"

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Film,
  Gamepad2,
  MessageCircle,
  Music,
  Plane,
  Trophy,
  Utensils,
} from 'lucide-react'
import { ForumThreadView } from './ForumThreadView'
import { CreateThreadForm } from './CreateThreadForm'
import { ThreadDetail } from './ThreadDetail'
import { MaterialLibrary } from './MaterialLibrary'

type ForumType = 'academy' | 'studio'
type View = 'categories' | 'threads' | 'create' | 'detail' | 'material'

const categories = [
  { id:'movies', title:'Movies, series & shows', description:'Talk about stories, characters, endings and recommendations.', icon:Film, image:'/images/forum/Lifetime.jpeg' },
  { id:'music', title:'Music', description:'Share artists, songs, concerts and the music you keep coming back to.', icon:Music, image:'/images/forum/Music.jpeg' },
  { id:'travels', title:'Travel', description:'Stories, destinations, cultural differences and travel plans.', icon:Plane, image:'/images/forum/Travel.jpeg' },
  { id:'food', title:'Food & cooking', description:'Recipes, restaurants, traditions and everything around food.', icon:Utensils, image:'/images/forum/Food.jpeg' },
  { id:'gaming', title:'Gaming & tech', description:'Games, devices, apps, AI and the technology you actually use.', icon:Gamepad2, image:'/images/forum/Gaming.jpeg' },
  { id:'sports', title:'Sports', description:'Matches, training, athletes and the sports you follow or practise.', icon:Trophy, image:'/images/forum/Sports.jpeg' },
  { id:'daily-life', title:'Daily life & random thoughts', description:'A flexible space to talk about everyday life and whatever is on your mind.', icon:MessageCircle, image:'/images/forum/Music.jpeg' },
  { id:'material', title:'Material', description:'Resources selected and shared by the Koterie teachers.', icon:BookOpen, image:'/images/forum/Material.jpeg', material:true },
]

export function ForumCategoriesDashboard({ forumType='academy' }: { forumType?: ForumType }) {
  const [view,setView] = useState<View>('categories')
  const [categoryId,setCategoryId] = useState('')
  const [threadId,setThreadId] = useState<string | null>(null)
  const category = categories.find((item)=>item.id===categoryId)
  const studio = forumType === 'studio'

  if (view === 'threads' && category) {
    return <ForumThreadView categoryId={category.id} categoryName={category.title} forumType={forumType} onBack={()=>{setView('categories');setCategoryId('')}} onThreadClick={(id)=>{setThreadId(id);setView('detail')}} onCreateThread={()=>setView('create')} />
  }

  if (view === 'create' && category) {
    return <CreateThreadForm categoryId={category.id} categoryName={category.title} forumType={forumType} onBack={()=>setView('threads')} onThreadCreated={(id)=>{setThreadId(id);setView('detail')}} />
  }

  if (view === 'detail' && threadId) {
    return <ThreadDetail threadId={threadId} categoryName={category?.title} forumType={forumType} onBack={()=>{setThreadId(null);setView('threads')}} />
  }

  if (view === 'material') return <MaterialLibrary onBack={()=>setView('categories')} />


  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <div className={`inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${studio?'border-pink-500/25 bg-pink-500/10 text-pink-300':'border-blue-500/25 bg-blue-500/10 text-blue-300'}`}>{studio?'Studio · advanced community':'Academy · learning community'}</div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">Choose something worth talking about.</h1>
          <p className="mt-4 text-lg leading-8 text-white/48">{studio?'Use English to develop ideas, debate and help keep the whole Koterie community moving.':'Ask, answer, share interests and use the English you are learning without pressure.'}</p>
          {!studio && <p className="mt-3 text-sm text-white/35">Academy members can also read Studio discussions. Participation in Studio is reserved for Studio members and teachers.</p>}
          <div className="mt-5">
            <Link href={studio?'/academy-forum':'/studio-forum'} className={`inline-flex rounded-xl border px-4 py-2.5 text-sm font-bold transition ${studio?'border-blue-400/20 bg-blue-400/[0.07] text-blue-200 hover:bg-blue-400/10':'border-pink-400/20 bg-pink-400/[0.07] text-pink-200 hover:bg-pink-400/10'}`}>
              {studio?'Go to Academy and help the community →':'Read Studio discussions →'}
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((item)=>{
            const Icon=item.icon
            return <button key={item.id} onClick={()=>{setCategoryId(item.id);setView(item.material?'material':'threads')}} className={`group relative min-h-[200px] overflow-hidden rounded-3xl border text-left transition sm:min-h-[220px] hover:-translate-y-1 hover:border-white/20 ${item.material?'border-amber-500/25 bg-amber-500/[0.025]':'border-white/[0.08] bg-white/[0.03]'}`}>
              <div className="absolute inset-0 bg-cover bg-center opacity-35 transition duration-500 group-hover:scale-105 group-hover:opacity-45" style={{backgroundImage:`url(${item.image})`}}/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-[#080c18]/70 to-black/10"/>
              <div className="relative flex min-h-[200px] flex-col justify-between p-5 sm:min-h-[220px] sm:p-6"><div className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 ${item.material?'bg-amber-500/15 text-amber-300':'bg-white/10 text-white'}`}><Icon className="h-5 w-5"/></div><div><h2 className={`text-xl font-bold ${item.material?'text-amber-300':'text-white'}`}>{item.title}</h2><p className="mt-2 text-sm leading-6 text-white/48">{item.description}</p></div></div>
            </button>
          })}
        </div>
      </div>
    </main>
  )
}
