"use client"

import { useState } from "react"
import { Calendar, Users, Award, Clock, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const upcomingSeminars = [
  {
    id: 1,
    title: "Business English Mastery",
    date: "15 de Abril",
    time: "18:00 HS",
    instructor: "Dr. Sarah Mitchell",
    level: "B2+",
    spots: 12,
    totalSpots: 30,
    tags: ["Negocios", "Presentaciones", "Networking"],
    rating: 4.9,
    image: "/images/business-seminar.jpg"
  },
  {
    id: 2,
    title: "IELTS Preparation Workshop",
    date: "22 de Abril", 
    time: "16:00 HS",
    instructor: "Prof. James Chen",
    level: "B1+",
    spots: 8,
    totalSpots: 25,
    tags: ["Exámenes", "Writing", "Speaking"],
    rating: 4.8,
    image: "/images/ielts-workshop.jpg"
  },
  {
    id: 3,
    title: "Creative Writing in English",
    date: "29 de Abril",
    time: "17:30 HS",
    instructor: "Emma Thompson",
    level: "A2+",
    spots: 15,
    totalSpots: 20,
    tags: ["Creatividad", "Storytelling", "Grammar"],
    rating: 4.7,
    image: "/images/creative-writing.jpg"
  }
]

interface SeminarCardProps {
  seminar: typeof upcomingSeminars[0]
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

function SeminarCard({ seminar, isHovered, onHover, onLeave }: SeminarCardProps) {
  const spotsPercentage = (seminar.spots / seminar.totalSpots) * 100

  return (
    <button
      className={cn(
        "group relative overflow-hidden rounded-2xl text-left transition-all duration-500",
        "glass border border-border/50",
        isHovered 
          ? "shadow-[0_8px_40px_oklch(0.72_0.19_220/0.2)] scale-[1.02] border-[oklch(0.72_0.19_220/0.3)]"
          : "shadow-[0_4px_20px_oklch(0_0_0/0.06)]"
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.72_0.19_220/0.02)] via-transparent to-[oklch(0.75_0.18_55/0.02)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative p-5 sm:p-6">
        {/* Header with date and rating */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-xl bg-primary/10 p-2">
              <Calendar className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-primary">{seminar.date}</p>
              <p className="text-[10px] text-muted-foreground">{seminar.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1">
            <Star className="size-3 fill-accent text-accent" />
            <span className="text-[10px] font-bold text-accent">{seminar.rating}</span>
          </div>
        </div>

        {/* Title and instructor */}
        <div className="mb-3">
          <h3 className="font-serif text-lg font-bold tracking-tight text-foreground mb-1">
            {seminar.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            con <span className="font-semibold text-foreground">{seminar.instructor}</span>
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {seminar.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary/50 px-2.5 py-1 text-[10px] font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Level and availability */}
        <div className="flex items-center justify-between mb-4">
          <span className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
            Nivel {seminar.level}
          </span>
          <div className="flex items-center gap-1.5">
            <Users className="size-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">
              <span className="font-bold text-foreground">{seminar.spots}</span> lugares
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${100 - spotsPercentage}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {seminar.totalSpots - seminar.spots} inscritos
          </span>
          <div className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-500",
            isHovered 
              ? "bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.72_0.19_220/0.3)]"
              : "bg-primary/10 text-primary"
          )}>
            Reservar
            <ChevronRight className={cn(
              "size-3 transition-transform duration-300",
              isHovered && "translate-x-0.5"
            )} />
          </div>
        </div>
      </div>
    </button>
  )
}

export function SeminarsSection() {
  const [hoveredSeminar, setHoveredSeminar] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.72_0.19_220)] to-[oklch(0.65_0.2_250)] p-2.5 shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)]">
            <Award className="size-5 text-[oklch(0.99_0_0)]" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold tracking-tight text-foreground">
              Seminarios Exclusivos
            </h2>
            <p className="text-sm text-muted-foreground">
              Acceso a workshops especializados con expertos internacionales
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-2xl glass px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:shadow-[0_4px_20px_oklch(0_0_0/0.06)]">
          <Clock className="size-4" />
          Ver todos
        </button>
      </div>

      {/* Seminars Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {upcomingSeminars.map((seminar) => (
          <SeminarCard
            key={seminar.id}
            seminar={seminar}
            isHovered={hoveredSeminar === seminar.id}
            onHover={() => setHoveredSeminar(seminar.id)}
            onLeave={() => setHoveredSeminar(null)}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-[oklch(0.72_0.19_220/0.05)] via-[oklch(0.72_0.22_350/0.05)] to-[oklch(0.75_0.18_55/0.05)] p-6 border border-border/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground mb-1">
              ¿Quieres ser instructor?
            </h3>
            <p className="text-sm text-muted-foreground">
              Comparte tu experiencia y gana impartiendo seminarios en nuestra comunidad
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_4px_20px_oklch(0.72_0.19_220/0.3)]">
            <Users className="size-4" />
            Postular
          </button>
        </div>
      </div>
    </div>
  )
}
