import { Suspense } from 'react'
import { discoverMedia, getMovieGenres, getTVGenres } from '@/lib/tmdb'
import MediaCard from '@/components/media/MediaCard'
import FilterBar from '@/components/filters/FilterBar'
import DiscoverTabs from '@/components/discover/DiscoverTabs'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  searchParams: Promise<{
    tab?: string
    sort?: string
    year_min?: string
    year_max?: string
    runtime_min?: string
    runtime_max?: string
    genres?: string
    page?: string
  }>
}

export default async function DiscoverPage({ searchParams }: Props) {
  const sp = await searchParams
  const tab = (sp.tab === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv'
  const sort = sp.sort ?? 'popularity.desc'
  const yearMin = sp.year_min ?? '1950'
  const yearMax = sp.year_max ?? String(new Date().getFullYear())
  const runtimeMin = sp.runtime_min ?? '0'
  const runtimeMax = sp.runtime_max ?? '300'
  const genreFilter = sp.genres ?? ''
  const page = Number(sp.page ?? '1')

  const [data, { genres: movieGenres }, { genres: tvGenres }] = await Promise.all([
    discoverMedia(tab, {
      page,
      sort_by: sort,
      with_genres: genreFilter || undefined,
      ...(tab === 'movie'
        ? {
            'primary_release_date.gte': `${yearMin}-01-01`,
            'primary_release_date.lte': `${yearMax}-12-31`,
            ...(runtimeMin !== '0' ? { 'with_runtime.gte': runtimeMin } : {}),
            ...(runtimeMax !== '300' ? { 'with_runtime.lte': runtimeMax } : {}),
          }
        : {
            'first_air_date.gte': `${yearMin}-01-01`,
            'first_air_date.lte': `${yearMax}-12-31`,
          }),
    }),
    getMovieGenres(),
    getTVGenres(),
  ])

  const genres = tab === 'movie' ? movieGenres : tvGenres
  const totalPages = Math.min(data.total_pages, 500)
  const selectedGenres = genreFilter ? genreFilter.split(',').filter(Boolean) : []
  const baseHref = `/discover?tab=${tab}&sort=${sort}&year_min=${yearMin}&year_max=${yearMax}&runtime_min=${runtimeMin}&runtime_max=${runtimeMax}`

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Discover</h1>
          <p className="text-gray-500 text-sm mt-1">{data.total_results.toLocaleString()} titles</p>
        </div>

        <Suspense fallback={null}>
          <DiscoverTabs activeTab={tab} />
        </Suspense>

        <div className="flex flex-wrap gap-2">
          {genres.map(g => {
            const gStr = String(g.id)
            const isSelected = selectedGenres.includes(gStr)
            const newGenres = isSelected
              ? selectedGenres.filter(x => x !== gStr).join(',')
              : [...selectedGenres, gStr].join(',')
            return (
              <Link
                key={g.id}
                href={`/discover?tab=${tab}&sort=${sort}&year_min=${yearMin}&year_max=${yearMax}&runtime_min=${runtimeMin}&runtime_max=${runtimeMax}&genres=${newGenres}&page=1`}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  isSelected
                    ? 'bg-brand text-white'
                    : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {g.name}
              </Link>
            )
          })}
        </div>

        <Suspense fallback={null}>
          <FilterBar
            showRuntime={tab === 'movie'}
            currentSort={sort}
            currentYearMin={yearMin}
            currentYearMax={yearMax}
            currentRuntimeMin={runtimeMin}
            currentRuntimeMax={runtimeMax}
          />
        </Suspense>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {data.results.map(item => (
            <MediaCard key={item.id} item={item} type={tab} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 pt-4">
          {page > 1 && (
            <Link href={`${baseHref}&genres=${genreFilter}&page=${page - 1}`}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </Link>
          )}
          <span className="text-gray-500 text-sm">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`${baseHref}&genres=${genreFilter}&page=${page + 1}`}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
