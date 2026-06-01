'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function DiscoverTabs({ activeTab }: { activeTab: 'movie' | 'tv' }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setTab(tab: 'movie' | 'tv') {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('tab', tab)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-1 p-1 bg-zinc-800 rounded-lg w-fit">
      {(['movie', 'tv'] as const).map(tab => (
        <button
          key={tab}
          onClick={() => setTab(tab)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab
              ? 'bg-brand text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab === 'movie' ? 'Movies' : 'TV Shows'}
        </button>
      ))}
    </div>
  )
}
