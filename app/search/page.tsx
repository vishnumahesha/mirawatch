import { searchMulti } from '@/lib/tmdb'
import MediaCard from '@/components/media/MediaCard'
import SearchInput from '@/components/search/SearchInput'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const trimmed = q?.trim()
  const results = trimmed ? await searchMulti(trimmed).catch(() => null) : null
  const filtered = results?.results.filter(
    r => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path
  ) ?? []

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-16">
      <div className="max-w-7xl mx-auto space-y-8">
        <SearchInput initialQuery={q ?? ''} />
        {trimmed && filtered.length === 0 && (
          <p className="text-gray-400">No results for &quot;{trimmed}&quot;</p>
        )}
        {filtered.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm mb-4">
              {results!.total_results} results for &quot;{trimmed}&quot;
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {filtered.map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  type={item.media_type === 'movie' ? 'movie' : 'tv'}
                />
              ))}
            </div>
          </div>
        )}
        {!trimmed && (
          <p className="text-gray-500 text-center pt-16">Search for movies and TV shows</p>
        )}
      </div>
    </div>
  )
}
