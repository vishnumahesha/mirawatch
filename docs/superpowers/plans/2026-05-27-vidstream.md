# Vidstream Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack streaming site (Vidstream) with TMDB metadata, Vidking iframe playback, Supabase auth + watch progress, and a Netflix-dark UI.

**Architecture:** Next.js 15 App Router, RSC-first. All TMDB calls in server-only lib (`lib/tmdb.ts`) — key never reaches the client. Proxy route at `/api/tmdb/[...path]` exists per spec. Supabase via `@supabase/ssr` — user-bound client everywhere, no service role. Params and cookies are Promises in Next.js 15 — always await them.

**Tech Stack:** Next.js 15, TypeScript strict, Tailwind CSS, shadcn/ui, Supabase (@supabase/ssr), lucide-react, Zod, Vercel

---

## File Map

```
/Users/newstudent/projects/vidstream/
├── app/
│   ├── layout.tsx                          # Root layout — Nav, dark HTML shell
│   ├── page.tsx                            # Home — Hero + streaming rows (RSC)
│   ├── globals.css                         # Tailwind + scrollbar-none utility
│   ├── error.tsx                           # App-level error boundary
│   ├── not-found.tsx                       # 404 page
│   ├── login/page.tsx                      # Magic link sign-in
│   ├── search/page.tsx                     # Multi-search results (RSC)
│   ├── movie/[id]/page.tsx                 # Movie detail
│   ├── tv/[id]/page.tsx                    # TV detail + season picker
│   ├── watch/movie/[id]/page.tsx           # Movie player page
│   ├── watch/tv/[id]/[season]/[ep]/page.tsx # TV episode player page
│   ├── api/
│   │   ├── tmdb/[...path]/route.ts         # TMDB proxy (server-side key injection)
│   │   ├── progress/route.ts              # Watch progress upsert endpoint
│   │   └── auth/callback/route.ts         # Supabase OAuth/magic-link callback
│   └── actions/
│       └── watchlist.ts                   # Server Actions for watchlist toggle
├── components/
│   ├── nav/Nav.tsx                         # Sticky nav (client — sign-out, dropdown)
│   ├── home/
│   │   ├── Hero.tsx                        # Full-bleed hero (server)
│   │   ├── MediaRow.tsx                    # Horizontal snap row (server)
│   │   └── ContinueWatching.tsx            # Resume row (client — needs session)
│   ├── media/
│   │   ├── MediaCard.tsx                   # Poster card (server)
│   │   ├── EpisodeCard.tsx                 # Episode row with thumb + progress
│   │   └── WatchlistButton.tsx             # Add/remove toggle (client)
│   ├── player/
│   │   └── Player.tsx                      # Vidking iframe + postMessage (client)
│   ├── search/
│   │   └── SearchInput.tsx                 # Debounced input → URL push (client)
│   └── tv/
│       └── SeasonSelector.tsx             # Season <Select> → URL push (client)
├── lib/
│   ├── env.ts                              # Zod env validation (throws on missing)
│   ├── tmdb.ts                             # Typed TMDB helpers (server-only)
│   ├── supabase/
│   │   ├── server.ts                       # createServerClient with async cookies()
│   │   └── browser.ts                      # createBrowserClient singleton
│   └── hooks/
│       └── useSession.ts                   # onAuthStateChange hook
├── middleware.ts                           # Redirect /watch/* if no session
├── tailwind.config.ts                      # + brand:#e50914 + background:#0a0a0a
├── next.config.ts                          # image.tmdb.org remotePatterns
└── .env.local                              # TMDB_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
```

---

## Task 1: Scaffold + Tailwind + shadcn + env

**Files:**
- Create: all scaffold files via create-next-app
- Create: `lib/env.ts`
- Create: `.env.local`
- Modify: `tailwind.config.ts`
- Modify: `next.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Scaffold Next.js 15 project**

Run from `/Users/newstudent/projects/` (the vidstream dir already has `docs/` — answer `y` if prompted about non-empty directory):

```bash
cd /Users/newstudent/projects
npx create-next-app@latest vidstream --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

When prompted:
- Would you like to use ESLint? → Yes
- Would you like your code inside a `src/` directory? → No
- Would you like to use Turbopack for `next dev`? → Yes

- [ ] **Step 2: Install runtime dependencies**

```bash
cd /Users/newstudent/projects/vidstream
npm install @supabase/supabase-js @supabase/ssr lucide-react zod
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d
```

When prompted, choose: New York style, Zinc base color, CSS variables yes.

- [ ] **Step 4: Add shadcn components**

```bash
npx shadcn@latest add button badge skeleton select dialog avatar dropdown-menu input
```

- [ ] **Step 5: Create `.env.local`**

```
TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

- [ ] **Step 6: Create `lib/env.ts`**

```typescript
import { z } from 'zod'

const schema = z.object({
  TMDB_API_KEY: z.string().min(1, 'TMDB_API_KEY is required'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
})

export const serverEnv = schema.parse({
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})
```

- [ ] **Step 7: Update `next.config.ts`**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 8: Add brand + background colors to `tailwind.config.ts`**

After shadcn init, find the `extend.colors` section and add:

```typescript
// Inside theme.extend.colors:
brand: '#e50914',
background: '#0a0a0a',
```

Full file after edit:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#e50914',
        background: '#0a0a0a',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

- [ ] **Step 9: Add scrollbar-none utility to `app/globals.css`**

Append to the end of globals.css (keep everything shadcn generated, just add this):

```css
@layer utilities {
  .scrollbar-none {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
}
```

Also update the `:root` CSS var for background in globals.css — find the `.dark` block and set:
```css
.dark {
  --background: 0 0% 4%;   /* #0a0a0a */
  /* keep all other shadcn vars */
}
```

- [ ] **Step 10: Verify TypeScript compiles**

```bash
cd /Users/newstudent/projects/vidstream
npx tsc --noEmit
```

Expected: no errors (may warn about empty files — that's fine).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15 + shadcn + Tailwind brand config"
```

---

## Task 2: TMDB proxy route + typed client

**Files:**
- Create: `app/api/tmdb/[...path]/route.ts`
- Create: `lib/tmdb.ts`

- [ ] **Step 1: Create `app/api/tmdb/[...path]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server'

const TMDB_BASE = 'https://api.themoviedb.org/3'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params
  const url = new URL(`${TMDB_BASE}/${path.join('/')}`)

  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })
  url.searchParams.set('api_key', process.env.TMDB_API_KEY!)

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'TMDB error' }, { status: res.status })
  }
  return NextResponse.json(await res.json())
}
```

- [ ] **Step 2: Create `lib/tmdb.ts`**

```typescript
import { z } from 'zod'

const TMDB_BASE = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

// ── Schemas ──────────────────────────────────────────────────────────────────

const GenreSchema = z.object({ id: z.number(), name: z.string() })

export const MovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  tagline: z.string().default(''),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().default(''),
  vote_average: z.number(),
  vote_count: z.number(),
  runtime: z.number().nullable(),
  genres: z.array(GenreSchema),
})

export const TVShowSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  tagline: z.string().default(''),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  first_air_date: z.string().default(''),
  vote_average: z.number(),
  vote_count: z.number(),
  genres: z.array(GenreSchema),
  number_of_seasons: z.number(),
  seasons: z.array(
    z.object({
      id: z.number(),
      season_number: z.number(),
      name: z.string(),
      episode_count: z.number(),
      poster_path: z.string().nullable(),
    })
  ),
})

export const EpisodeSchema = z.object({
  id: z.number(),
  episode_number: z.number(),
  name: z.string(),
  overview: z.string().default(''),
  still_path: z.string().nullable(),
  runtime: z.number().nullable(),
  air_date: z.string().nullable(),
})

export const SeasonSchema = z.object({
  id: z.number(),
  season_number: z.number(),
  name: z.string(),
  episodes: z.array(EpisodeSchema),
})

export const MediaItemSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  name: z.string().optional(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable().optional(),
  vote_average: z.number().default(0),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
  media_type: z.string().optional(),
  overview: z.string().default(''),
})

export const MediaListSchema = z.object({
  results: z.array(MediaItemSchema),
  page: z.number(),
  total_pages: z.number(),
  total_results: z.number(),
})

export type Movie = z.infer<typeof MovieSchema>
export type TVShow = z.infer<typeof TVShowSchema>
export type Episode = z.infer<typeof EpisodeSchema>
export type Season = z.infer<typeof SeasonSchema>
export type MediaItem = z.infer<typeof MediaItemSchema>

// ── Fetch helper ──────────────────────────────────────────────────────────────

async function tmdbFetch<T>(
  schema: z.ZodType<T>,
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${TMDB_BASE}/${path}`)
  url.searchParams.set('api_key', process.env.TMDB_API_KEY!)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`)
  return schema.parse(await res.json())
}

// ── Exports ───────────────────────────────────────────────────────────────────

export const getTrending = (
  type: 'all' | 'movie' | 'tv' = 'all',
  window: 'day' | 'week' = 'week'
) => tmdbFetch(MediaListSchema, `trending/${type}/${window}`)

export const getPopularMovies = () => tmdbFetch(MediaListSchema, 'movie/popular')
export const getPopularTV = () => tmdbFetch(MediaListSchema, 'tv/popular')
export const getTopRatedMovies = () => tmdbFetch(MediaListSchema, 'movie/top_rated')
export const getTopRatedTV = () => tmdbFetch(MediaListSchema, 'tv/top_rated')
export const getMovieDetails = (id: number) => tmdbFetch(MovieSchema, `movie/${id}`)
export const getTVDetails = (id: number) => tmdbFetch(TVShowSchema, `tv/${id}`)
export const getTVSeason = (id: number, season: number) =>
  tmdbFetch(SeasonSchema, `tv/${id}/season/${season}`)
export const searchMulti = (query: string) =>
  tmdbFetch(MediaListSchema, 'search/multi', { query })
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/tmdb lib/tmdb.ts
git commit -m "feat: TMDB proxy route and typed server client"
```

---

## Task 3: Supabase clients + auth flow + middleware

**Files:**
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/browser.ts`
- Create: `lib/hooks/useSession.ts`
- Create: `app/api/auth/callback/route.ts`
- Create: `app/login/page.tsx`
- Create: `middleware.ts`

**Before coding — apply Supabase schema:**
In the Supabase dashboard SQL editor, run:

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

Also enable **Email** provider with **magic link** in Supabase → Authentication → Providers.
Set **Site URL** to `http://localhost:3000` (update to production URL before deploy).
Add `http://localhost:3000/api/auth/callback` to **Redirect URLs**.

- [ ] **Step 1: Create `lib/supabase/server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // read-only in Server Components — ignored
          }
        },
      },
    }
  )
}
```

- [ ] **Step 2: Create `lib/supabase/browser.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowser() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
```

- [ ] **Step 3: Create `lib/hooks/useSession.ts`**

```typescript
'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  return { session, user: session?.user ?? null, loading }
}
```

- [ ] **Step 4: Create `app/api/auth/callback/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
```

- [ ] **Step 5: Create `app/login/page.tsx`**

```tsx
import { Suspense } from 'react'
import LoginForm from './LoginForm'
import { Tv } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center text-brand">
            <Tv className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign in to Vidstream</h1>
          <p className="text-gray-400 text-sm">Enter your email for a magic link</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `app/login/LoginForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await getSupabaseBrowser().auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center space-y-1">
        <p className="text-green-400 font-medium">Check your email</p>
        <p className="text-gray-400 text-sm">Magic link sent to {email}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-brand hover:bg-brand/90 text-white"
      >
        {loading ? 'Sending…' : 'Send magic link'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 7: Create `middleware.ts`** (at project root, next to `package.json`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/watch')) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/watch/:path*'],
}
```

- [ ] **Step 8: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add lib/supabase lib/hooks app/api/auth app/login middleware.ts
git commit -m "feat: Supabase clients, magic link auth, /watch/* middleware"
```

---

## Task 4: Home page + Nav + Card + layout

**Files:**
- Create: `components/nav/Nav.tsx`
- Modify: `app/layout.tsx`
- Create: `components/media/MediaCard.tsx`
- Create: `components/home/Hero.tsx`
- Create: `components/home/MediaRow.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/nav/Nav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { Tv, Search, LogOut, Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

export default function Nav({ user }: { user: User | null }) {
  const router = useRouter()

  async function signOut() {
    await getSupabaseBrowser().auth.signOut()
    router.refresh()
  }

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand">
          <Tv className="w-6 h-6" />
          Vidstream
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/search" className="text-gray-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-brand text-white text-sm font-medium">
                      {user.email?.[0]?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white">
                <DropdownMenuItem asChild>
                  <Link href="/watchlist" className="flex items-center gap-2 cursor-pointer">
                    <Bookmark className="w-4 h-4" /> Watchlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={signOut}
                  className="flex items-center gap-2 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-950"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/nav/Nav'
import { createClient } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Vidstream',
  description: 'Stream movies and TV shows',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-white antialiased min-h-screen`}>
        <Nav user={user} />
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create `components/media/MediaCard.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import type { MediaItem } from '@/lib/tmdb'
import { TMDB_IMAGE_BASE } from '@/lib/tmdb'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

type Props = {
  item: MediaItem
  type: 'movie' | 'tv'
}

export default function MediaCard({ item, type }: Props) {
  const title = item.title ?? item.name ?? 'Unknown'
  const year = (item.release_date ?? item.first_air_date ?? '').slice(0, 4)

  return (
    <Link href={`/${type}/${item.id}`} className="snap-start flex-none w-36 md:w-44 group">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-800">
        {item.poster_path ? (
          <Image
            src={`${TMDB_IMAGE_BASE}/w342${item.poster_path}`}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 144px, 176px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs text-center p-2">
            No image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/70 text-white text-xs gap-1 flex items-center border-0 px-1.5 py-0.5">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            {item.vote_average.toFixed(1)}
          </Badge>
        </div>
      </div>
      <div className="mt-1.5 px-0.5 space-y-0.5">
        <p className="text-sm text-white leading-tight truncate">{title}</p>
        {year && <p className="text-xs text-gray-500">{year}</p>}
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: Create `components/home/Hero.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { getTrending, TMDB_IMAGE_BASE } from '@/lib/tmdb'
import { Button } from '@/components/ui/button'
import { Play, Info } from 'lucide-react'

export default async function Hero() {
  const trending = await getTrending('all', 'week')
  const item = trending.results.find(r => r.backdrop_path) ?? trending.results[0]
  if (!item) return null

  const title = item.title ?? item.name ?? ''
  const type = item.media_type === 'movie' ? 'movie' : 'tv'
  const watchHref = type === 'movie' ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`

  return (
    <div className="relative h-[85vh] w-full">
      {item.backdrop_path && (
        <Image
          src={`${TMDB_IMAGE_BASE}/original${item.backdrop_path}`}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-end pb-24 px-4 md:px-8">
        <div className="max-w-xl space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
            {title}
          </h1>
          {item.overview && (
            <p className="text-gray-300 text-sm md:text-base line-clamp-3 drop-shadow">
              {item.overview}
            </p>
          )}
          <div className="flex gap-3">
            <Button asChild className="bg-brand hover:bg-brand/90 text-white gap-2">
              <Link href={watchHref}>
                <Play className="w-4 h-4 fill-white" /> Watch Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 gap-2 bg-white/5 backdrop-blur-sm"
            >
              <Link href={`/${type}/${item.id}`}>
                <Info className="w-4 h-4" /> More Info
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/home/MediaRow.tsx`**

```tsx
import MediaCard from '@/components/media/MediaCard'
import type { MediaItem } from '@/lib/tmdb'

type Props = {
  title: string
  items: MediaItem[]
  type?: 'movie' | 'tv'
}

export default function MediaRow({ title, items, type }: Props) {
  return (
    <section className="px-4 md:px-8 space-y-3">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none">
        {items.map(item => {
          const mediaType = (type ?? (item.media_type === 'movie' ? 'movie' : 'tv')) as 'movie' | 'tv'
          return <MediaCard key={item.id} item={item} type={mediaType} />
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Replace `app/page.tsx`**

```tsx
import { Suspense } from 'react'
import Hero from '@/components/home/Hero'
import MediaRow from '@/components/home/MediaRow'
import ContinueWatching from '@/components/home/ContinueWatching'
import { Skeleton } from '@/components/ui/skeleton'
import { getTrending, getPopularMovies, getPopularTV, getTopRatedMovies } from '@/lib/tmdb'
import { createClient } from '@/lib/supabase/server'

async function TrendingRow() {
  const data = await getTrending()
  return <MediaRow title="Trending This Week" items={data.results} />
}
async function PopularMoviesRow() {
  const data = await getPopularMovies()
  return <MediaRow title="Popular Movies" items={data.results} type="movie" />
}
async function PopularTVRow() {
  const data = await getPopularTV()
  return <MediaRow title="Popular TV" items={data.results} type="tv" />
}
async function TopRatedRow() {
  const data = await getTopRatedMovies()
  return <MediaRow title="Top Rated" items={data.results} type="movie" />
}

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

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen pb-16">
      <Suspense fallback={<div className="h-[85vh] bg-zinc-900 animate-pulse" />}>
        <Hero />
      </Suspense>
      <div className="relative z-10 -mt-16 space-y-10 pt-8">
        {user && (
          <Suspense fallback={null}>
            <ContinueWatching />
          </Suspense>
        )}
        <Suspense fallback={<RowSkeleton />}><TrendingRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><PopularMoviesRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><PopularTVRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><TopRatedRow /></Suspense>
      </div>
    </main>
  )
}
```

Note: `ContinueWatching` is created in Task 7. Add a placeholder file now:

```tsx
// components/home/ContinueWatching.tsx  (placeholder — replaced in Task 7)
export default function ContinueWatching() {
  return null
}
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: `http://localhost:3000` loads with hero image and rows. No TypeScript errors in terminal.

- [ ] **Step 8: Commit**

```bash
git add app/layout.tsx app/page.tsx components/
git commit -m "feat: home page, nav, hero, media rows, card"
```

---

## Task 5: Movie + TV detail pages

**Files:**
- Create: `app/movie/[id]/page.tsx`
- Create: `components/tv/SeasonSelector.tsx`
- Create: `components/media/EpisodeCard.tsx`
- Create: `app/tv/[id]/page.tsx`
- Create: `components/media/WatchlistButton.tsx` (placeholder — filled in Task 9)

- [ ] **Step 1: Create placeholder `components/media/WatchlistButton.tsx`**

```tsx
export default function WatchlistButton(_props: {
  mediaType: 'movie' | 'tv'
  tmdbId: number
  title: string
  posterPath: string | null
  initialInWatchlist: boolean
}) {
  return null
}
```

- [ ] **Step 2: Create `app/movie/[id]/page.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMovieDetails, TMDB_IMAGE_BASE } from '@/lib/tmdb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Star, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import WatchlistButton from '@/components/media/WatchlistButton'

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let movie
  try { movie = await getMovieDetails(Number(id)) } catch { notFound() }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let inWatchlist = false
  if (user) {
    const { data } = await supabase
      .from('watchlist')
      .select('tmdb_id')
      .eq('user_id', user.id)
      .eq('tmdb_id', movie.id)
      .eq('media_type', 'movie')
      .maybeSingle()
    inWatchlist = !!data
  }

  const backdrop = movie.backdrop_path ? `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}` : null
  const poster = movie.poster_path ? `${TMDB_IMAGE_BASE}/w500${movie.poster_path}` : null

  return (
    <div className="min-h-screen">
      {backdrop && (
        <div className="relative h-[50vh]">
          <Image src={backdrop} alt={movie.title} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}
      <div className={`max-w-5xl mx-auto px-4 md:px-8 pb-16 ${backdrop ? '-mt-32 relative z-10' : 'pt-24'}`}>
        <div className="flex flex-col md:flex-row gap-8">
          {poster && (
            <div className="flex-none w-48 md:w-64 hidden md:block">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image src={poster} alt={movie.title} fill className="object-cover" sizes="256px" />
              </div>
            </div>
          )}
          <div className="flex-1 space-y-4 pt-4 md:pt-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{movie.title}</h1>
            {movie.tagline && <p className="text-gray-400 italic">{movie.tagline}</p>}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map(g => (
                <Badge key={g.id} variant="secondary" className="bg-zinc-800 text-gray-300 border-0">
                  {g.name}
                </Badge>
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="bg-brand hover:bg-brand/90 text-white gap-2">
                <Link href={`/watch/movie/${movie.id}`}>
                  <Play className="w-4 h-4 fill-white" /> Watch Now
                </Link>
              </Button>
              {user && (
                <WatchlistButton
                  mediaType="movie"
                  tmdbId={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  initialInWatchlist={inWatchlist}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/tv/SeasonSelector.tsx`**

```tsx
'use client'

import { useRouter } from 'next/navigation'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

type Season = { id: number; season_number: number; name: string; episode_count: number }

export default function SeasonSelector({
  showId, seasons, currentSeason,
}: {
  showId: number
  seasons: Season[]
  currentSeason: number
}) {
  const router = useRouter()
  return (
    <Select
      value={String(currentSeason)}
      onValueChange={v => router.push(`/tv/${showId}?s=${v}`)}
    >
      <SelectTrigger className="w-52 bg-zinc-800 border-zinc-700 text-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border-zinc-700">
        {seasons.map(s => (
          <SelectItem
            key={s.id}
            value={String(s.season_number)}
            className="text-white focus:bg-zinc-700 focus:text-white"
          >
            {s.name} ({s.episode_count} eps)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

- [ ] **Step 4: Create `components/media/EpisodeCard.tsx`**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Episode } from '@/lib/tmdb'
import { TMDB_IMAGE_BASE } from '@/lib/tmdb'
import { Play, Clock } from 'lucide-react'

type Props = {
  showId: number
  seasonNum: number
  episode: Episode
  progress: number
}

export default function EpisodeCard({ showId, seasonNum, episode, progress }: Props) {
  const href = `/watch/tv/${showId}/${seasonNum}/${episode.episode_number}`
  const thumb = episode.still_path ? `${TMDB_IMAGE_BASE}/w300${episode.still_path}` : null
  const showBar = progress > 0.04 && progress < 0.96

  return (
    <Link
      href={href}
      className="flex gap-4 p-3 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 transition-colors group border border-white/5"
    >
      <div className="flex-none w-32 md:w-40 relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
        {thumb ? (
          <Image src={thumb} alt={episode.name} fill className="object-cover" sizes="160px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-5 h-5 text-zinc-600" />
          </div>
        )}
        {showBar && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700">
            <div className="h-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-start gap-2">
          <span className="text-gray-500 text-sm flex-none">{episode.episode_number}.</span>
          <h3 className="text-white font-medium text-sm leading-tight line-clamp-1">{episode.name}</h3>
        </div>
        {episode.runtime && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> {episode.runtime}m
          </p>
        )}
        {episode.overview && (
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">{episode.overview}</p>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 5: Create `app/tv/[id]/page.tsx`**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTVDetails, getTVSeason, TMDB_IMAGE_BASE } from '@/lib/tmdb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import WatchlistButton from '@/components/media/WatchlistButton'
import EpisodeCard from '@/components/media/EpisodeCard'
import SeasonSelector from '@/components/tv/SeasonSelector'

export default async function TVPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ s?: string }>
}) {
  const [{ id }, { s }] = await Promise.all([params, searchParams])

  let show
  try { show = await getTVDetails(Number(id)) } catch { notFound() }

  const mainSeasons = show.seasons.filter(sn => sn.season_number > 0)
  const seasonNum = Number(s ?? mainSeasons[0]?.season_number ?? 1)

  let seasonData
  try { seasonData = await getTVSeason(Number(id), seasonNum) } catch { notFound() }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const progressMap: Record<number, number> = {}
  if (user) {
    const { data: rows } = await supabase
      .from('watch_progress')
      .select('episode, progress')
      .eq('user_id', user.id)
      .eq('media_type', 'tv')
      .eq('tmdb_id', show.id)
      .eq('season', seasonNum)
    rows?.forEach(r => { if (r.episode != null) progressMap[r.episode] = r.progress })
  }

  const backdrop = show.backdrop_path ? `${TMDB_IMAGE_BASE}/original${show.backdrop_path}` : null
  const poster = show.poster_path ? `${TMDB_IMAGE_BASE}/w500${show.poster_path}` : null

  return (
    <div className="min-h-screen">
      {backdrop && (
        <div className="relative h-[50vh]">
          <Image src={backdrop} alt={show.name} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}
      <div className={`max-w-5xl mx-auto px-4 md:px-8 pb-16 ${backdrop ? '-mt-32 relative z-10' : 'pt-24'}`}>
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {poster && (
            <div className="flex-none w-48 md:w-64 hidden md:block">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image src={poster} alt={show.name} fill className="object-cover" sizes="256px" />
              </div>
            </div>
          )}
          <div className="flex-1 space-y-4 pt-4 md:pt-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{show.name}</h1>
            {show.tagline && <p className="text-gray-400 italic">{show.tagline}</p>}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              {show.first_air_date && <span>{show.first_air_date.slice(0, 4)}</span>}
              <span>{show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''}</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                {show.vote_average.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {show.genres.map(g => (
                <Badge key={g.id} variant="secondary" className="bg-zinc-800 text-gray-300 border-0">
                  {g.name}
                </Badge>
              ))}
            </div>
            <p className="text-gray-300 leading-relaxed">{show.overview}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="bg-brand hover:bg-brand/90 text-white gap-2">
                <Link href={`/watch/tv/${show.id}/1/1`}>
                  <Play className="w-4 h-4 fill-white" /> Watch Now
                </Link>
              </Button>
              {user && (
                <WatchlistButton
                  mediaType="tv"
                  tmdbId={show.id}
                  title={show.name}
                  posterPath={show.poster_path}
                  initialInWatchlist={false}
                />
              )}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {mainSeasons.length > 1 && (
            <SeasonSelector showId={show.id} seasons={mainSeasons} currentSeason={seasonNum} />
          )}
          <div className="space-y-3">
            {seasonData.episodes.map(ep => (
              <EpisodeCard
                key={ep.id}
                showId={show.id}
                seasonNum={seasonNum}
                episode={ep}
                progress={progressMap[ep.episode_number] ?? 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add app/movie app/tv components/tv components/media
git commit -m "feat: movie and TV detail pages with season picker"
```

---

## Task 6: Player pages + progress API

**Files:**
- Create: `components/player/Player.tsx`
- Create: `app/api/progress/route.ts`
- Create: `app/watch/movie/[id]/page.tsx`
- Create: `app/watch/tv/[id]/[season]/[ep]/page.tsx`

- [ ] **Step 1: Create `components/player/Player.tsx`**

```tsx
'use client'

import { useEffect, useRef, useCallback } from 'react'

type Props = {
  type: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
  startSeconds?: number
  title?: string
  posterPath?: string | null
  backdropPath?: string | null
  episodeTitle?: string | null
}

type PlayerEventPayload = {
  event: string
  currentTime: number
  duration: number
  progress: number
}

const DEBOUNCE_MS = 5000
const VIDKING_ORIGIN = 'https://www.vidking.net'

export default function Player({
  type, tmdbId, season, episode, startSeconds = 0,
  title, posterPath, backdropPath, episodeTitle,
}: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const src =
    type === 'movie'
      ? `${VIDKING_ORIGIN}/embed/movie/${tmdbId}?color=e50914&autoPlay=true&progress=${startSeconds}`
      : `${VIDKING_ORIGIN}/embed/tv/${tmdbId}/${season}/${episode}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true&progress=${startSeconds}`

  const saveProgress = useCallback(
    async (payload: PlayerEventPayload) => {
      if (!payload.duration || payload.duration < 1) return
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: type,
          tmdb_id: tmdbId,
          season: season ?? null,
          episode: episode ?? null,
          current_time_s: payload.currentTime,
          duration_s: payload.duration,
          progress: payload.progress,
          title,
          poster_path: posterPath ?? null,
          backdrop_path: backdropPath ?? null,
          episode_title: episodeTitle ?? null,
        }),
      })
    },
    [type, tmdbId, season, episode, title, posterPath, backdropPath, episodeTitle]
  )

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== VIDKING_ORIGIN) return
      let msg: { type?: string; data?: PlayerEventPayload & { event?: string } } | null = null
      try { msg = typeof e.data === 'string' ? JSON.parse(e.data) : e.data } catch { return }
      if (!msg || msg.type !== 'PLAYER_EVENT' || !msg.data) return

      const { event, ...rest } = msg.data

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
  }, [saveProgress])

  return (
    <iframe
      src={src}
      className="w-full h-full"
      allow="fullscreen; autoplay; encrypted-media"
      allowFullScreen
    />
  )
}
```

- [ ] **Step 2: Create `app/api/progress/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const BodySchema = z.object({
  media_type: z.enum(['movie', 'tv']),
  tmdb_id: z.number().int().positive(),
  season: z.number().int().nullable(),
  episode: z.number().int().nullable(),
  current_time_s: z.number().min(0),
  duration_s: z.number().positive(),
  progress: z.number().min(0).max(1),
  title: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  episode_title: z.string().nullable().optional(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = BodySchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const d = parsed.data

  // Manual upsert: coalesce-based unique constraint can't use onConflict columns directly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let q: any = supabase
    .from('watch_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('media_type', d.media_type)
    .eq('tmdb_id', d.tmdb_id)

  q = d.season != null ? q.eq('season', d.season) : q.is('season', null)
  q = d.episode != null ? q.eq('episode', d.episode) : q.is('episode', null)

  const { data: existing } = await q.maybeSingle()

  const row = {
    user_id: user.id,
    media_type: d.media_type,
    tmdb_id: d.tmdb_id,
    season: d.season,
    episode: d.episode,
    current_time_s: d.current_time_s,
    duration_s: d.duration_s,
    progress: d.progress,
    title: d.title ?? null,
    poster_path: d.poster_path ?? null,
    backdrop_path: d.backdrop_path ?? null,
    episode_title: d.episode_title ?? null,
    updated_at: new Date().toISOString(),
  }

  const { error } = existing
    ? await supabase.from('watch_progress').update(row).eq('id', existing.id)
    : await supabase.from('watch_progress').insert(row)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 3: Create `app/watch/movie/[id]/page.tsx`**

```tsx
import { notFound, redirect } from 'next/navigation'
import { getMovieDetails } from '@/lib/tmdb'
import Player from '@/components/player/Player'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function WatchMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/watch/movie/${id}`)

  let movie
  try { movie = await getMovieDetails(Number(id)) } catch { notFound() }

  const { data: prog } = await supabase
    .from('watch_progress')
    .select('current_time_s')
    .eq('user_id', user.id)
    .eq('media_type', 'movie')
    .eq('tmdb_id', movie.id)
    .is('season', null)
    .maybeSingle()

  return (
    <div className="fixed inset-0 bg-black z-50">
      <Link
        href={`/movie/${id}`}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <Player
        type="movie"
        tmdbId={movie.id}
        startSeconds={prog?.current_time_s ?? 0}
        title={movie.title}
        posterPath={movie.poster_path}
        backdropPath={movie.backdrop_path}
      />
    </div>
  )
}
```

- [ ] **Step 4: Create `app/watch/tv/[id]/[season]/[ep]/page.tsx`**

```tsx
import { notFound, redirect } from 'next/navigation'
import { getTVDetails, getTVSeason } from '@/lib/tmdb'
import Player from '@/components/player/Player'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function WatchTVPage({
  params,
}: {
  params: Promise<{ id: string; season: string; ep: string }>
}) {
  const { id, season, ep } = await params
  const sNum = Number(season)
  const eNum = Number(ep)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/watch/tv/${id}/${season}/${ep}`)

  let show, seasonData
  try {
    ;[show, seasonData] = await Promise.all([
      getTVDetails(Number(id)),
      getTVSeason(Number(id), sNum),
    ])
  } catch { notFound() }

  const episode = seasonData.episodes.find(e => e.episode_number === eNum)
  if (!episode) notFound()

  const { data: prog } = await supabase
    .from('watch_progress')
    .select('current_time_s')
    .eq('user_id', user.id)
    .eq('media_type', 'tv')
    .eq('tmdb_id', show.id)
    .eq('season', sNum)
    .eq('episode', eNum)
    .maybeSingle()

  return (
    <div className="fixed inset-0 bg-black z-50">
      <Link
        href={`/tv/${id}?s=${season}`}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <Player
        type="tv"
        tmdbId={show.id}
        season={sNum}
        episode={eNum}
        startSeconds={prog?.current_time_s ?? 0}
        title={show.name}
        posterPath={show.poster_path}
        backdropPath={show.backdrop_path}
        episodeTitle={episode.name}
      />
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/player app/api/progress app/watch
git commit -m "feat: player pages, Vidking embed, progress API"
```

---

## Task 7: Continue Watching row

**Files:**
- Modify: `components/home/ContinueWatching.tsx` (replace placeholder)

- [ ] **Step 1: Replace `components/home/ContinueWatching.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { TMDB_IMAGE_BASE } from '@/lib/tmdb'
import { Play } from 'lucide-react'

type Row = {
  id: string
  media_type: 'movie' | 'tv'
  tmdb_id: number
  season: number | null
  episode: number | null
  progress: number
  title: string | null
  poster_path: string | null
}

export default function ContinueWatching() {
  const [items, setItems] = useState<Row[]>([])

  useEffect(() => {
    getSupabaseBrowser()
      .from('watch_progress')
      .select('id, media_type, tmdb_id, season, episode, progress, title, poster_path, updated_at')
      .gte('progress', 0.05)
      .lt('progress', 0.95)
      .order('updated_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setItems((data ?? []) as Row[]))
  }, [])

  if (items.length === 0) return null

  return (
    <section className="px-4 md:px-8 space-y-3">
      <h2 className="text-lg font-semibold text-white">Continue Watching</h2>
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none">
        {items.map(item => {
          const href =
            item.media_type === 'movie'
              ? `/watch/movie/${item.tmdb_id}`
              : `/watch/tv/${item.tmdb_id}/${item.season}/${item.episode}`

          return (
            <Link key={item.id} href={href} className="snap-start flex-none w-36 md:w-44 group">
              <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-800">
                {item.poster_path && (
                  <Image
                    src={`${TMDB_IMAGE_BASE}/w342${item.poster_path}`}
                    alt={item.title ?? ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 144px, 176px"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                  <Play className="w-8 h-8 text-white fill-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-700">
                  <div className="h-full bg-brand" style={{ width: `${item.progress * 100}%` }} />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1 truncate">{item.title}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/home/ContinueWatching.tsx
git commit -m "feat: continue watching row with Supabase progress query"
```

---

## Task 8: Search page

**Files:**
- Create: `components/search/SearchInput.tsx`
- Create: `app/search/page.tsx`

- [ ] **Step 1: Create `components/search/SearchInput.tsx`**

```tsx
'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SearchInput({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value.trim()
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
    }, 400)
  }

  return (
    <div className="relative max-w-2xl w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <Input
        defaultValue={initialQuery}
        onChange={handleChange}
        placeholder="Search movies and TV shows…"
        className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus-visible:ring-brand"
        autoFocus
      />
    </div>
  )
}
```

- [ ] **Step 2: Create `app/search/page.tsx`**

```tsx
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
          <p className="text-gray-400">No results for "{trimmed}"</p>
        )}
        {filtered.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm mb-4">
              {results!.total_results} results for "{trimmed}"
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
```

- [ ] **Step 3: Commit**

```bash
git add components/search app/search
git commit -m "feat: search page with debounced client input"
```

---

## Task 9: Watchlist add/remove

**Files:**
- Create: `app/actions/watchlist.ts`
- Modify: `components/media/WatchlistButton.tsx` (replace placeholder)

- [ ] **Step 1: Create `app/actions/watchlist.ts`**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWatchlist({
  mediaType,
  tmdbId,
  title,
  posterPath,
  inWatchlist,
  path,
}: {
  mediaType: 'movie' | 'tv'
  tmdbId: number
  title: string
  posterPath: string | null
  inWatchlist: boolean
  path: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  if (inWatchlist) {
    await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('media_type', mediaType)
      .eq('tmdb_id', tmdbId)
  } else {
    await supabase.from('watchlist').insert({
      user_id: user.id,
      media_type: mediaType,
      tmdb_id: tmdbId,
      title,
      poster_path: posterPath,
    })
  }

  revalidatePath(path)
  return { ok: true }
}
```

- [ ] **Step 2: Replace `components/media/WatchlistButton.tsx`**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { toggleWatchlist } from '@/app/actions/watchlist'

type Props = {
  mediaType: 'movie' | 'tv'
  tmdbId: number
  title: string
  posterPath: string | null
  initialInWatchlist: boolean
}

export default function WatchlistButton({
  mediaType, tmdbId, title, posterPath, initialInWatchlist,
}: Props) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  function handleClick() {
    const prev = inWatchlist
    setInWatchlist(!prev)
    startTransition(async () => {
      const result = await toggleWatchlist({
        mediaType, tmdbId, title, posterPath,
        inWatchlist: prev,
        path: pathname,
      })
      if (result.error) setInWatchlist(prev)
    })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant="outline"
      className="border-white/20 text-white hover:bg-white/10 gap-2 bg-transparent"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : inWatchlist ? (
        <><BookmarkCheck className="w-4 h-4 fill-white" /> In Watchlist</>
      ) : (
        <><Bookmark className="w-4 h-4" /> Add to Watchlist</>
      )}
    </Button>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/actions components/media/WatchlistButton.tsx
git commit -m "feat: watchlist server action and optimistic toggle button"
```

---

## Task 10: Error boundaries + not-found + build verification

**Files:**
- Create: `app/error.tsx`
- Create: `app/not-found.tsx`
- Create: `app/loading.tsx`

- [ ] **Step 1: Create `app/error.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
        <p className="text-gray-400 text-sm">{error.message}</p>
        <Button onClick={reset} className="bg-brand hover:bg-brand/90">Try again</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/not-found.tsx`**

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-bold text-brand">404</h1>
        <p className="text-gray-400">This page doesn't exist</p>
        <Button asChild className="bg-brand hover:bg-brand/90">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create `app/loading.tsx`**

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
```

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors. Warnings about missing env vars are expected if `.env.local` has placeholder values.

- [ ] **Step 5: Final commit**

```bash
git add app/error.tsx app/not-found.tsx app/loading.tsx
git commit -m "feat: error boundary, 404, loading state — deploy ready"
```

---

## Deploy Notes

Before deploying to Vercel:

1. Push to GitHub: `git remote add origin <repo-url> && git push -u origin main`
2. Import repo in Vercel dashboard
3. Add environment variables in Vercel → Settings → Environment Variables:
   - `TMDB_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. In Supabase → Authentication → URL Configuration:
   - Update **Site URL** to your Vercel production URL
   - Add `https://your-app.vercel.app/api/auth/callback` to **Redirect URLs**
5. Deploy
