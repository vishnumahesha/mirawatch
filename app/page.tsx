import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import MediaRow from '@/components/home/MediaRow'
import ContinueWatching from '@/components/home/ContinueWatching'
import { Skeleton } from '@/components/ui/skeleton'
import {
  getTrending,
  getNowPlayingMovies,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  getUpcomingMovies,
  getAiringTodayTV,
} from '@/lib/tmdb'

function RowSkeleton() {
  return (
    <div className="px-4 md:px-8 space-y-3">
      <Skeleton className="h-6 w-48 bg-zinc-800" />
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="flex-none w-36 md:w-44 aspect-[2/3] rounded-md bg-zinc-800" />
        ))}
      </div>
    </div>
  )
}

async function HomeRows() {
  const [
    trending,
    nowPlaying,
    popularMovies,
    popularTV,
    topRatedMovies,
    topRatedTV,
    upcoming,
    airingToday,
  ] = await Promise.all([
    getTrending('all', 'week'),
    getNowPlayingMovies(),
    getPopularMovies(),
    getPopularTV(),
    getTopRatedMovies(),
    getTopRatedTV(),
    getUpcomingMovies(),
    getAiringTodayTV(),
  ])

  return (
    <>
      <MediaRow title="Trending Now"       items={trending.results} />
      <MediaRow title="New Releases"       items={nowPlaying.results}   type="movie" />
      <MediaRow title="Popular Movies"     items={popularMovies.results} type="movie" />
      <MediaRow title="Popular TV Shows"   items={popularTV.results}    type="tv" />
      <MediaRow title="Top Rated Movies"   items={topRatedMovies.results} type="movie" />
      <MediaRow title="Top Rated TV Shows" items={topRatedTV.results}   type="tv" />
      <MediaRow title="Upcoming Movies"    items={upcoming.results}     type="movie" />
      <MediaRow title="Airing Today"       items={airingToday.results}  type="tv" />
    </>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen pb-16">
      <Suspense fallback={<div className="h-[85vh] bg-zinc-900 animate-pulse" />}>
        <Hero />
      </Suspense>
      <div className="relative z-10 -mt-16 space-y-10 pt-8">
        <ContinueWatching />
        <Suspense fallback={
          <div className="space-y-10">
            {Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)}
          </div>
        }>
          <HomeRows />
        </Suspense>
      </div>
    </main>
  )
}
