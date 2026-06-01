import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Watchlist — Mirage' }
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TMDB_IMAGE_BASE } from '@/lib/tmdb'
import { Play, Bookmark } from 'lucide-react'

export default async function WatchlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/watchlist')

  const { data: items } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = items ?? []

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Bookmark className="w-6 h-6 text-brand" />
          <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
        </div>
        {list.length === 0 ? (
          <div className="text-center py-24 space-y-3">
            <Bookmark className="w-12 h-12 text-zinc-700 mx-auto" />
            <p className="text-gray-400">Your watchlist is empty.</p>
            <p className="text-gray-500 text-sm">
              Browse{' '}
              <Link href="/" className="text-brand hover:underline">movies and TV shows</Link>{' '}
              and add them here.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm">{list.length} title{list.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {list.map((item) => {
                const href = `/${item.media_type}/${item.tmdb_id}`
                return (
                  <Link key={item.id} href={href} className="group">
                    <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-800">
                      {item.poster_path ? (
                        <Image
                          src={`${TMDB_IMAGE_BASE}/w342${item.poster_path}`}
                          alt={item.title ?? ''}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 144px, 176px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs text-center p-2">
                          No image
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-sm text-white leading-tight truncate mt-1.5 px-0.5">
                      {item.title}
                    </p>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
