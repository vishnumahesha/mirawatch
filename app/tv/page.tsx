import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import MediaRow from '@/components/home/MediaRow'
import GenreChips from '@/components/media/GenreChips'
import RowSkeleton from '@/components/home/RowSkeleton'
import {
  getPopularTV, getTopRatedTV,
  getAiringTodayTV, getOnTheAirTV, getTVGenres,
} from '@/lib/tmdb'

async function PopularRow() {
  const d = await getPopularTV()
  return <MediaRow title="Popular" items={d.results} type="tv" />
}
async function TopRatedRow() {
  const d = await getTopRatedTV()
  return <MediaRow title="Top Rated" items={d.results} type="tv" />
}
async function AiringTodayRow() {
  const d = await getAiringTodayTV()
  return <MediaRow title="Airing Today" items={d.results} type="tv" />
}
async function OnTheAirRow() {
  const d = await getOnTheAirTV()
  return <MediaRow title="On The Air" items={d.results} type="tv" />
}
async function Genres() {
  const { genres } = await getTVGenres()
  return <GenreChips genres={genres} mediaType="tv" />
}

export default function TVPage() {
  return (
    <main className="min-h-screen pb-16">
      <Suspense fallback={<div className="h-[85vh] bg-zinc-900 animate-pulse" />}>
        <Hero type="tv" />
      </Suspense>
      <div className="relative z-10 -mt-16 space-y-10 pt-8">
        <Suspense fallback={<RowSkeleton />}><PopularRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><TopRatedRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><AiringTodayRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><OnTheAirRow /></Suspense>
        <Suspense fallback={null}><Genres /></Suspense>
      </div>
    </main>
  )
}
