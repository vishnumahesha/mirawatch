'use client'

import { useRouter } from 'next/navigation'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

type Season = { id: number; season_number: number; name: string; episode_count: number }

export default function SeasonSelector({
  showId, seasons, currentSeason,
}: {
  showId: number
  seasons: Season[]
  currentSeason: number
}) {
  const router = useRouter()
  return (
    <Select
      value={String(currentSeason)}
      onValueChange={v => router.push(`/tv/${showId}?s=${v}`)}
    >
      <SelectTrigger className="w-52 bg-zinc-800 border-zinc-700 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border-zinc-700">
        {seasons.map(s => (
          <SelectItem
            key={s.id}
            value={String(s.season_number)}
            className="text-white focus:bg-zinc-700 focus:text-white"
          >
            {s.name} ({s.episode_count} eps)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
