"use client"

import { useState } from "react"
import {
  Film,
  Music,
  Plane,
  Utensils,
  Gamepad2,
  Trophy,
  MessageCircle,
  BookOpen,
  FileText,
  Headphones,
  ClipboardCheck,
} from "lucide-react"
import { ForumThreadView } from "./ForumThreadView"
import { CreateThreadForm } from "./CreateThreadForm"
import { ThreadDetail } from "./ThreadDetail"
import { MaterialSubcategoryView } from "./MaterialSubcategoryView"

interface Category {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  isMaterial?: boolean
  image?: string
  subcategories?: Array<{
    id: string
    name: string
    description: string
    downloadLinks: Array<{ name: string; url: string }>
  }>
}

interface ForumCategoriesDashboardProps {
  forumType?: 'academy' | 'studio'
}

const categories: Category[] = [
  {
    id: 'movies',
    title: 'Movies, series & shows',
    description: 'Talk about stories, characters, endings and recommendations.',
    icon: <Film className="h-6 w-6" />,
    color: 'from-purple-500/20 to-pink-500/20',
    image: '/images/forum/Lifetime.jpeg',
  },
  {
    id: 'music',
    title: 'Music',
    description: 'Share artists, songs, concerts and the music you keep coming back to.',
    icon: <Music className="h-6 w-6" />,
    color: 'from-blue-500/20 to-cyan-500/20',
    image: '/images/forum/Music.jpeg',
  },
  {
    id: 'travels',
    title: 'Travel',
    description: 'Stories, destinations, cultural differences and travel plans.',
    icon: <Plane className="h-6 w-6" />,
    color: 'from-green-500/20 to-emerald-500/20',
    image: '/images/forum/Travel.jpeg',
  },
  {
    id: 'food',
    title: 'Food & cooking',
    description: 'Recipes, restaurants, traditions and everything around food.',
    icon: <Utensils className="h-6 w-6" />,
    color: 'from-orange-500/20 to-red-500/20',
    image: '/images/forum/Food.jpeg',
  },
  {
    id: 'gaming',
    title: 'Gaming & tech',
    description: 'Games, devices, apps, AI and the technology you actually use.',
    icon: <Gamepad2 className="h-6 w-6" />,
    color: 'from-indigo-500/20 to-purple-500/20',
    image: '/images/forum/Gaming.jpeg',
  },
  {
    id: 'sports',
    title: 'Sports',
    description: 'Matches, training, athletes and the sports you follow or practise.',
    icon: <Trophy className="h-6 w-6" />,
    color: 'from-yellow-500/20 to-orange-500/20',
    image: '/images/forum/Sports.jpeg',
  },
  {
    id: 'daily-life',
    title: 'Daily life & random thoughts',
    description: 'A flexible space to talk about everyday life and whatever is on your mind.',
    icon: <MessageCircle className="h-6 w-6" />,
    color: 'from-pink-500/20 to-rose-500/20',
    image: '/images/forum/Music.jpeg',
  },
  {
    id: 'material',
    title: 'Material',
    description: 'Resources shared by the Koterie teachers.',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'from-amber-500/20 to-yellow-500/20',
    image: '/images/forum/Material.jpeg',
    isMaterial: true,
    subcategories: [
      { id: 'books', name: 'Books', description: 'Reading and reference material selected by the teachers.', downloadLinks: [] },
      { id: 'study-guides', name: 'Study Guides', description: 'Guides and worksheets prepared for Koterie students.', downloadLinks: [] },
      { id: 'audio', name: 'Audio', description: 'Listening and pronunciation resources.', downloadLinks: [] },
      { id: 'exams', name: 'Exam Practice', description: 'Practice material when a group needs exam preparation.', downloadLinks: [] },
    ],
  },
]

export function ForumCategoriesDashboard({ forumType = 'academy' }: ForumCategoriesDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<'categories' | 'threads' | 'create' | 'detail'>('categories')
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)

  const selectedCategoryData = categories.find((category) => category.id === selectedCategory)
  const selectedSubcategoryData = selectedCategoryData?.subcategories?.find((subcategory) => subcategory.id === selectedSubcategory)
  const isStudio = forumType === 'studio'

  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find((item) => item.id === categoryId)
    setSelectedCategory(categoryId)
    if (!category?.isMaterial) setCurrentView('threads')
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setSelectedSubcategory(null)
    setCurrentView('categories')
    setSelectedThreadId(null)
  }

  if (currentView === 'threads' && selectedCategory && !selectedCategoryData?.isMaterial) {
    return (
      <ForumThreadView
        categoryId={selectedCategory}
        categoryName={selectedCategoryData?.title || ''}
        onBack={handleBackToCategories}
        onThreadClick={(threadId) => {
          setSelectedThreadId(threadId)
          setCurrentView('detail')
        }}
        onCreateThread={() => setCurrentView('create')}
        forumType={forumType}
      />
    )
  }

  if (currentView === 'create' && selectedCategory && !selectedCategoryData?.isMaterial) {
    return (
      <CreateThreadForm
        categoryId={selectedCategory}
        categoryName={selectedCategoryData?.title || ''}
        onBack={() => setCurrentView('threads')}
        onThreadCreated={(threadId) => {
          setSelectedThreadId(threadId)
          setCurrentView('detail')
        }}
        forumType={forumType}
      />
    )
  }

  if (currentView === 'detail' && selectedThreadId) {
    return (
      <ThreadDetail
        threadId={selectedThreadId}
        onBack={() => {
          setCurrentView('threads')
          setSelectedThreadId(null)
        }}
        categoryName={selectedCategoryData?.title || undefined}
        forumType={forumType}
      />
    )
  }

  if (selectedSubcategoryData) {
    return (
      <MaterialSubcategoryView
        subcategoryId={selectedSubcategory}
        subcategoryName={selectedSubcategoryData.name}
        subcategoryDescription={selectedSubcategoryData.description}
        onBack={() => setSelectedSubcategory(null)}
        staticLinks={selectedSubcategoryData.downloadLinks}
      />
    )
  }

  if (selectedCategoryData?.subcategories) {
    return (
      <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <button onClick={() => setSelectedCategory(null)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
            ← Back to community
          </button>
          <div className="mt-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-300">Koterie resources</p>
            <h1 className="mt-3 text-4xl font-bold">Material</h1>
            <p className="mt-3 max-w-2xl text-white/45">This area starts empty on purpose. Ana Laura and Cintia can add the material they actually want students to use.</p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {selectedCategoryData.subcategories.map((subcategory) => (
              <button key={subcategory.id} onClick={() => setSelectedSubcategory(subcategory.id)} className="group rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 text-left transition hover:border-amber-400/25 hover:bg-white/[0.05]">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-300">
                    {subcategory.id === 'books' && <BookOpen className="h-6 w-6" />}
                    {subcategory.id === 'study-guides' && <FileText className="h-6 w-6" />}
                    {subcategory.id === 'audio' && <Headphones className="h-6 w-6" />}
                    {subcategory.id === 'exams' && <ClipboardCheck className="h-6 w-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{subcategory.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/45">{subcategory.description}</p>
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-amber-300/70">No material published yet</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0f1e] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <div className={`inline-flex rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${isStudio ? 'border-pink-500/25 bg-pink-500/10 text-pink-300' : 'border-blue-500/25 bg-blue-500/10 text-blue-300'}`}>
            {isStudio ? 'Studio · advanced community' : 'Academy · learning community'}
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Choose something worth talking about.</h1>
          <p className="mt-4 text-lg leading-8 text-white/48">
            {isStudio
              ? 'Studio is the advanced conversation space. Use English, develop ideas and help keep the whole Koterie community moving.'
              : 'Academy is a place to practise without pressure. Ask, answer, share interests and use the English you are learning.'}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <button key={category.id} onClick={() => handleCategoryClick(category.id)} className={`group relative min-h-[220px] overflow-hidden rounded-3xl border bg-white/[0.03] text-left transition hover:-translate-y-1 hover:border-white/20 ${category.isMaterial ? 'border-amber-500/25' : 'border-white/[0.08]'}`}>
              <div className="absolute inset-0 bg-cover bg-center opacity-45 transition duration-500 group-hover:scale-105 group-hover:opacity-55" style={{ backgroundImage: `url(${category.image})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c18] via-[#080c18]/65 to-black/10" />
              <div className="relative flex min-h-[220px] flex-col justify-between p-6">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${category.color} text-white`}>
                  {category.icon}
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${category.isMaterial ? 'text-amber-300' : 'text-white'}`}>{category.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/50">{category.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
