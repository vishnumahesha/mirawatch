# Vidstream — Design Spec
**Date:** 2026-05-27  
**Stack:** Next.js 15 App Router · TypeScript strict · Tailwind · Supabase · shadcn/ui · lucide-react  
**Deploy target:** Vercel

---

## Overview

Vidstream is a dark-themed streaming site. TMDB provides metadata; Vidking provides video playback via iframe embed. Supabase stores auth, watch progress, and watchlists.

---

## Architecture

### Rendering Model

App Router with RSC-first rendering. Server Components handle all TMDB fetches (home rows, detail pages, search). Client Components are limited to:
- `Player` — iframe + postMessage listener
- `SearchInput` — debounced input
- `ContinueWatching` — requires Supabase session
- `WatchlistButton` — optimistic toggle
- `useSession` hook — auth state subscription

### TMDB Proxy

All TMDB calls go through `/app/api/tmdb/[...path]/route.ts`, which proxies to `api.themoviedb.org` with `TMDB_API_KEY` injected server-side. The typed client `lib/tmdb.ts` calls this proxy exclusively. No API key is ever sent to the client.

### Supabase Clients

- `lib/supabase/server.ts` — `createServerClient` from `@supabase/ssr` with `cookies()`. Used in Server Components, Route Handlers, Server Actions, and Middleware.
- `lib/supabase/browser.ts` — `createBrowserClient` singleton. Used in Client Components.

**No service role key anywhere.** All writes go through the user-bound client so RLS applies.

### Auth State (Client)

A `useSession` hook: calls `supabase.auth.getSession()` on mount, subscribes to `onAuthStateChange`. Server Components pass `session` as a prop where possible.

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home: hero + continue-watching + trending + popular movies/TV + top rated |
| `/search?q=...` | Multi-search results (SSR) |
| `/movie/[id]` | Movie detail |
| `/tv/[id]?s=1` | TV detail with season picker |
| `/watch/movie/[id]` | Movie player |
| `/watch/tv/[id]/[season]/[ep]` | TV episode player |
| `/login` | Magic link auth |

Middleware protects `/watch/*`. Unauthenticated requests redirect to `/login?next=<url>`.

---

## TMDB Typed Client (`lib/tmdb.ts`)

Zod schemas for all used response shapes:
- `MovieSchema`, `TVShowSchema`, `EpisodeSchema`, `CastMemberSchema`
- `TrendingResponseSchema`, `SearchResponseSchema`

Helper functions (all call the proxy):
- `getTrending(type, timeWindow)`
- `getPopularMovies()`, `getPopularTV()`
- `getTopRated(type)`
- `getMovieDetails(id)`, `getTVDetails(id)`
- `getTVSeason(id, season)`
- `searchMulti(query)`

---

## Vidking Embed

```
Movie: https://www.vidking.net/embed/movie/{tmdbId}?color=e50914&autoPlay=true&progress={seconds}
TV:    https://www.vidking.net/embed/tv/{tmdbId}/{s}/{e}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true&progress={seconds}
```

Player sends `window.postMessage` with JSON string:
```json
{
  "type": "PLAYER_EVENT",
  "data": {
    "event": "timeupdate|play|pause|ended|seeked",
    "currentTime": 0,
    "duration": 0,
    "progress": 0,
    "id": "",
    "mediaType": "movie|tv",
    "season": null,
    "episode": null,
    "timestamp": 0
  }
}
```

**Write strategy:**
- `timeupdate` → debounced 5s
- `pause`, `ended`, `seeked` → immediate write
- All writes go to `/api/progress` (Route Handler using user-bound server client)

**Progress seed:** Watch pages fetch existing `current_time_s` from Supabase server-side and pass it to `Player` so playback resumes.

---

## Supabase Schema

```sql
create table watch_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  media_type text not null check (media_type in ('movie','tv')),
  tmdb_id int not null,
  season int, episode int,
  current_time_s float not null,
  duration_s float not null,
  progress float not null,
  title text, poster_path text, backdrop_path text, episode_title text,
  updated_at timestamptz default now(),
  unique (user_id, media_type, tmdb_id, coalesce(season, 0), coalesce(episode, 0))
);
alter table watch_progress enable row level security;
create policy "own rows" on watch_progress for all using (auth.uid() = user_id);

create table watchlist (
  user_id uuid references auth.users not null,
  media_type text not null,
  tmdb_id int not null,
  title text, poster_path text,
  added_at timestamptz default now(),
  primary key (user_id, media_type, tmdb_id)
);
alter table watchlist enable row level security;
create policy "own rows" on watchlist for all using (auth.uid() = user_id);
```

---

## Auth

- Supabase magic link only
- `/login` page with email input → `supabase.auth.signInWithOtp`
- Middleware (`middleware.ts`) protects `/watch/*` using `createServerClient` with `cookies()`
- Post-login redirect via `next` query param

---

## UI/UX

**Theme:** Background `#0a0a0a`, accent `#e50914` registered as `brand` in Tailwind config. All text white/gray-300/gray-500.

**Nav:** Sticky, `backdrop-blur-md`, semi-transparent bg. Logo left, search + avatar right. Avatar opens `DropdownMenu` (profile, watchlist, sign out).

**Hero:** Full-width backdrop image, gradient overlay (transparent → bg), title, tagline, rating, genre badges, Watch Now + More Info buttons.

**Rows:** `overflow-x-auto snap-x snap-mandatory`, gap-3, hide scrollbar. Each item `snap-start`. Row title + optional "See all" link.

**Cards:** Poster (w-40), title truncated, year, rating `Badge`. Hover: scale-105 + play overlay icon.

**Detail pages:**
- Full backdrop behind frosted content panel
- Movie: title, tagline, overview, genres, cast row, Watch Now, Add to Watchlist
- TV: same + `Select` season picker + episode grid (thumb, number, title, runtime, progress bar if watched)

**Player page:** Full-viewport iframe. Spinner until first `play` event. Back button top-left.

**Skeletons:** `animate-pulse` divs matching card/hero shapes, shown via `<Suspense fallback={...}>`.

**Error boundaries:** Each home row wrapped individually so one failed fetch doesn't break the page.

**shadcn/ui components:** `Button`, `Badge`, `Skeleton`, `Select`, `Dialog` (trailer modal), `Avatar`, `DropdownMenu`.

---

## Env Vars

```
TMDB_API_KEY=                      # server-only
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Validated at startup via `lib/env.ts` using Zod (throws on missing vars so the app fails fast rather than at request time).

---

## Build Order

1. Scaffold + Tailwind + shadcn init + env validation
2. TMDB proxy route + typed client (`lib/tmdb.ts`) with Zod schemas
3. Supabase clients (server + browser), auth flow, middleware
4. Home page (server-rendered rows) + Card component
5. Detail pages (movie + TV with season fetcher)
6. Player route with postMessage listener + debounced upsert hook
7. Continue Watching row (queries Supabase)
8. Search page (server action with debounce on client input)
9. Watchlist add/remove
10. Loading states, error boundaries, deploy to Vercel

---

## Key Constraints

- Ask before installing anything beyond: `next`, `react`, `tailwind`, `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `zod`, `shadcn`
- No service role key in codebase
- TMDB key stays server-side only
- Components under 150 lines
- Mobile-first (375px minimum)
