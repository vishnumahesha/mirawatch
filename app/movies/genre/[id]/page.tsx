import { Suspense } from 'react'
import { discoverMedia } from '@/lib/tmdb'
import MediaCard from '@/components/media/MediaCard'
import FilterBar from '@/components/filters/FilterBar'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    sort?: string
    year_min?: string
    year_max?: string
    runtime_min?: string
    runtime_max?: string
    page?: string
    name?: string
  }>
}

export default async function MovieGenrePage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const genreId = Number(id)
  const sort = sp.sort ?? 'popularity.desc'
  const yearMin = sp.year_min ?? '1950'
  const yearMax = sp.year_max ?? String(new Date().getFullYear())
  const runtimeMin = sp.runtime_min ?? '0'
  const runtimeMax = sp.runtime_max ?? '300'
  const page = Number(sp.page ?? '1')
  const genreName = sp.name ?? 'Genre'

  const data = await discoverMedia('movie', {
    page,
    sort_by: sort,
    with_genres: String(genreId),
    'primary_release_date.gte': `${yearMin}-01-01`,
    'primary_release_date.lte': `${yearMax}-12-31`,
    ...(runtimeMin !== '0' ? { 'with_runtime.gte': runtimeMin } : {}),
    ...(runtimeMax !== '300' ? { 'with_runtime.lte': runtimeMax } : {}),
  })

  const totalPages = Math.min(data.total_pages, 500)
  const baseHref = `/movies/genre/${id}?name=${encodeURIComponent(genreName)}&sort=${sort}&year_min=${yearMin}&year_max=${yearMax}&runtime_min=${runtimeMin}&runtime_max=${runtimeMax}`

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-gray-500 text-sm uppercase tracking-wide mb-1">Movies</p>
          <h1 className="text-2xl font-bold text-white">{genreName}</h1>
          <p className="text-gray-500 text-sm mt-1">{data.total_results.toLocaleString()} titles</p>
        </div>
        <Suspense fallback={null}>
          <FilterBar
            showRuntime
            currentSort={sort}
            currentYearMin={yearMin}
            currentYearMax={yearMax}
            currentRuntimeMin={runtimeMin}
            currentRuntimeMax={runtimeMax}
          />
        </Suspense>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {data.results.map(item => (
            <MediaCard key={item.id} item={item} type="movie" />
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 pt-4">
          {page > 1 && (
            <Link href={`${baseHref}&page=${page - 1}`}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>
          )}
          <span className="text-gray-500 text-sm">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`${baseHref}&page=${page + 1}`}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
