import Link from 'next/link'
import type { Genre } from '@/lib/tmdb'

type Props = {
  genres: Genre[]
  mediaType: 'movies' | 'tv'
}

export default function GenreChips({ genres, mediaType }: Props) {
  return (
    <section className="px-4 md:px-8 space-y-3">
      <h2 className="text-lg font-semibold text-white">Browse by Genre</h2>
      <div className="flex flex-wrap gap-2">
        {genres.map(g => (
          <Link
            key={g.id}
            href={`/${mediaType}/genre/${g.id}?name=${encodeURIComponent(g.name)}`}
            className="px-4 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sm text-gray-300 hover:text-white transition-colors"
          >
            {g.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
