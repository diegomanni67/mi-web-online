export type ActivitySpace = 'academy' | 'studio'

const academy = [
  ['Small wins', 'Tell the community about one small thing you achieved this week. Ask one follow-up question to another student.'],
  ['Would you rather?', 'Choose: work four long days or five shorter days? Explain your choice and respond to someone who chose differently.'],
  ['A recommendation', 'Recommend a film, series, song, place or app. Explain why someone should try it using at least three descriptive adjectives.'],
  ['A useful mistake', 'Describe a mistake that taught you something. What happened, what did you learn, and what would you do differently now?'],
  ['The best part of my week', 'Describe one moment from this week in enough detail that another person can picture it. Then ask someone about theirs.'],
  ['A habit worth keeping', 'Talk about one habit that makes your life easier or better. How did you start it, and why does it work for you?'],
]

const studio = [
  ['Unpopular opinion', 'Share an opinion you can defend in English. Give two reasons and challenge another member with one thoughtful question.'],
  ['Pitch it', 'Pitch an idea, product, trip or project in 120 words or less. Make the opening sentence strong enough to keep people reading.'],
  ['What would you change?', 'Choose one everyday system—work, education, transport or social media—and argue for one concrete change.'],
  ['Story with a twist', 'Write a short true or fictional story in English. The final sentence must change how the reader understands the story.'],
  ['Defend the opposite', 'Choose an opinion you normally disagree with and make the strongest reasonable case for it. Then explain where you still disagree.'],
  ['Explain it simply', 'Choose something you know well and explain it in clear English to someone with no background knowledge. Avoid jargon.'],
]

function weekIndex(date = new Date()) {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1)
  return Math.floor((utc - yearStart) / 604800000)
}

export function rotatingActivity(space: ActivitySpace, date = new Date()) {
  const bank = space === 'studio' ? studio : academy
  const [title, prompt] = bank[weekIndex(date) % bank.length]
  return {
    id: `rotation-${space}-${weekIndex(date)}`,
    space,
    title,
    prompt,
    activity_type: 'discussion',
    source: 'rotation' as const,
  }
}
