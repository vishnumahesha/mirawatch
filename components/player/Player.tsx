'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { getWatchProgress, setWatchProgress, progressKey, type ProgressData } from '@/lib/storage'
import { vidkingUrl, vidsrcUrl, SOURCE_LABELS, type Source } from '@/lib/streams'

type Props = {
  type: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
  title?: string
  posterPath?: string | null
  backdropPath?: string | null
  episodeTitle?: string | null
  backHref?: string
}

type PlayerEventPayload = {
  currentTime: number
  duration: number
  progress: number
}

const DEBOUNCE_MS = 5000
const VIDKING_ORIGIN = 'https://www.vidking.net'
const PLAYBACK_TIMEOUT_MS = 10_000

export default function Player({
  type, tmdbId, season, episode,
  title, posterPath, backdropPath, episodeTitle,
  backHref,
}: Props) {
  const key = progressKey(type, tmdbId, season, episode)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [startSeconds, setStartSeconds] = useState<number | null>(null)
  const [source, setSource] = useState<Source>('vidking')
  const [failed, setFailed] = useState(false)
  const [playbackStarted, setPlaybackStarted] = useState(false)

  // Read resume position from localStorage
  useEffect(() => {
    const saved = getWatchProgress(key)
    setStartSeconds(saved?.currentTime ?? 0)
  }, [key])

  // Reset failure state when source changes
  useEffect(() => {
    setFailed(false)
    setPlaybackStarted(false)
  }, [source])

  // 10-second timeout — if no play/timeupdate arrives, show error
  useEffect(() => {
    if (startSeconds === null || playbackStarted) return
    timeoutRef.current = setTimeout(() => setFailed(true), PLAYBACK_TIMEOUT_MS)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [startSeconds, source, playbackStarted])

  const saveProgress = useCallback(
    (payload: PlayerEventPayload) => {
      if (!payload.duration || payload.duration < 1) return
      const data: ProgressData = {
        mediaType: type,
        tmdbId,
        season: season ?? null,
        episode: episode ?? null,
        currentTime: payload.currentTime,
        duration: payload.duration,
        progress: payload.progress,
        updatedAt: new Date().toISOString(),
        title: title ?? undefined,
        posterPath: posterPath ?? null,
        backdropPath: backdropPath ?? null,
        episodeTitle: episodeTitle ?? null,
      }
      setWatchProgress(key, data)
    },
    [key, type, tmdbId, season, episode, title, posterPath, backdropPath, episodeTitle]
  )

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== VIDKING_ORIGIN) return
      let msg: { type?: string; data?: PlayerEventPayload & { event?: string } } | null = null
      try { msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data } catch { return }
      if (!msg || msg.type !== 'PLAYER_EVENT' || !msg.data) return

      const { event, ...rest } = msg.data

      if (event === 'play' || event === 'timeupdate') {
        // Clear the failure timeout — player is alive
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (!playbackStarted) setPlaybackStarted(true)
      }

      if (event === 'timeupdate') {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => saveProgress(rest as PlayerEventPayload), DEBOUNCE_MS)
      } else if (event === 'pause' || event === 'ended' || event === 'seeked') {
        if (timerRef.current) clearTimeout(timerRef.current)
        saveProgress(rest as PlayerEventPayload)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [saveProgress, playbackStarted])

  if (startSeconds === null) return <div className="w-full h-full bg-black" />

  const src = source === 'vidking'
    ? vidkingUrl(type, tmdbId, season, episode, startSeconds)
    : vidsrcUrl(type, tmdbId, season, episode)

  const otherSource: Source = source === 'vidking' ? 'vidsrc' : 'vidking'

  if (failed) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-5">
          <AlertCircle className="w-12 h-12 text-zinc-500 mx-auto" />
          <p className="text-white text-base leading-relaxed">
            This title isn&apos;t available to stream right now. It may be added
            soon — try again later, or check back when it&apos;s been released for
            a few weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setSource(otherSource)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try {SOURCE_LABELS[otherSource]}
            </button>
            {backHref && (
              <Link
                href={backHref}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-white text-sm transition-colors text-center"
              >
                Back to Detail
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <iframe
        key={`${source}-${startSeconds}`}
        src={src}
        className="flex-1 w-full"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        allowFullScreen
      />
      <div className="flex justify-center py-2 bg-black">
        <button
          onClick={() => setSource(otherSource)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1 rounded hover:bg-white/5"
        >
          Try {SOURCE_LABELS[otherSource]}
        </button>
      </div>
    </div>
  )
}
