import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import MediaRow from '@/components/home/MediaRow'
import GenreChips from '@/components/media/GenreChips'
import RowSkeleton from '@/components/home/RowSkeleton'
import {
  getPopularMovies, getTopRatedMovies,
  getNowPlayingMovies, getUpcomingMovies, getMovieGenres,
} from '@/lib/tmdb'

async function PopularRow() {
  const d = await getPopularMovies()
  return <MediaRow title="Popular" items={d.results} type="movie" />
}
async function TopRatedRow() {
  const d = await getTopRatedMovies()
  return <MediaRow title="Top Rated" items={d.results} type="movie" />
}
async function NowPlayingRow() {
  const d = await getNowPlayingMovies()
  return <MediaRow title="Now Playing" items={d.results} type="movie" />
}
async function UpcomingRow() {
  const d = await getUpcomingMovies()
  return <MediaRow title="Upcoming" items={d.results} type="movie" />
}
async function Genres() {
  const { genres } = await getMovieGenres()
  return <GenreChips genres={genres} mediaType="movies" />
}

export default function MoviesPage() {
  return (
    <main className="min-h-screen pb-16">
      <Suspense fallback={<div className="h-[85vh] bg-zinc-900 animate-pulse" />}>
        <Hero type="movie" />
      </Suspense>
      <div className="relative z-10 -mt-16 space-y-10 pt-8">
        <Suspense fallback={<RowSkeleton />}><PopularRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><TopRatedRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><NowPlayingRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><UpcomingRow /></Suspense>
        <Suspense fallback={null}><Genres /></Suspense>
      </div>
    </main>
  )
}
