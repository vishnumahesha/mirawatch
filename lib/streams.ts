export type Source = 'vidking' | 'vidsrc'

export function vidkingUrl(
  type: 'movie' | 'tv',
  tmdbId: number,
  season?: number,
  episode?: number,
  startSeconds = 0
): string {
  const base = 'https://www.vidking.net/embed'
  const params = `color=e50914&autoPlay=true&progress=${startSeconds}`
  return type === 'movie'
    ? `${base}/movie/${tmdbId}?${params}`
    : `${base}/tv/${tmdbId}/${season}/${episode}?${params}&nextEpisode=true&episodeSelector=true`
}

export function vidsrcUrl(
  type: 'movie' | 'tv',
  tmdbId: number,
  season?: number,
  episode?: number
): string {
  const base = 'https://vidsrc.to/embed'
  return type === 'movie'
    ? `${base}/movie/${tmdbId}`
    : `${base}/tv/${tmdbId}/${season}/${episode}`
}

export const SOURCE_LABELS: Record<Source, string> = {
  vidking: 'Source 1',
  vidsrc: 'Source 2',
}
