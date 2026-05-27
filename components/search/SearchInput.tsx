'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchInput({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value.trim()
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
    }, 400)
  }

  return (
    <div className="relative max-w-2xl w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <Input
        defaultValue={initialQuery}
        onChange={handleChange}
        placeholder="Search movies and TV shows..."
        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus-visible:ring-brand"
        autoFocus
      />
    </div>
  )
}
