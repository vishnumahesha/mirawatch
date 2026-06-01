'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

type Props = {
  showRuntime?: boolean
  currentSort: string
  currentYearMin: string
  currentYearMax: string
  currentRuntimeMin?: string
  currentRuntimeMax?: string
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS_ASC = Array.from({ length: CURRENT_YEAR - 1949 }, (_, i) => String(1950 + i))
const YEARS_DESC = [...YEARS_ASC].reverse()

export default function FilterBar({
  showRuntime = false,
  currentSort,
  currentYearMin,
  currentYearMax,
  currentRuntimeMin = '0',
  currentRuntimeMax = '300',
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '')
      params.set(key, value)
      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Select value={currentSort} onValueChange={v => { if (v) update('sort', v) }}>
        <SelectTrigger className="w-44 bg-zinc-800 border-white/10 text-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 text-white">
          <SelectItem value="popularity.desc">Most Popular</SelectItem>
          <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
          <SelectItem value="primary_release_date.desc">Newest First</SelectItem>
          <SelectItem value="title.asc">Title A-Z</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentYearMin} onValueChange={v => { if (v) update('year_min', v) }}>
        <SelectTrigger className="w-32 bg-zinc-800 border-white/10 text-white">
          <SelectValue placeholder="From year" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-60">
          {YEARS_DESC.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={currentYearMax} onValueChange={v => { if (v) update('year_max', v) }}>
        <SelectTrigger className="w-32 bg-zinc-800 border-white/10 text-white">
          <SelectValue placeholder="To year" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-60">
          {YEARS_DESC.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
        </SelectContent>
      </Select>

      {showRuntime && (
        <>
          <Select value={currentRuntimeMin} onValueChange={v => { if (v) update('runtime_min', v) }}>
            <SelectTrigger className="w-36 bg-zinc-800 border-white/10 text-white">
              <SelectValue placeholder="Min runtime" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="0">Any length</SelectItem>
              <SelectItem value="60">60+ min</SelectItem>
              <SelectItem value="90">90+ min</SelectItem>
              <SelectItem value="120">120+ min</SelectItem>
            </SelectContent>
          </Select>
          <Select value={currentRuntimeMax} onValueChange={v => { if (v) update('runtime_max', v) }}>
            <SelectTrigger className="w-36 bg-zinc-800 border-white/10 text-white">
              <SelectValue placeholder="Max runtime" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="60">Up to 60 min</SelectItem>
              <SelectItem value="90">Up to 90 min</SelectItem>
              <SelectItem value="120">Up to 120 min</SelectItem>
              <SelectItem value="180">Up to 180 min</SelectItem>
              <SelectItem value="300">Any length</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  )
}
