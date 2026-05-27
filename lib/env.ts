import { z } from 'zod'

const schema = z.object({
  TMDB_API_KEY: z.string().min(1, 'TMDB_API_KEY is required'),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
})

export const serverEnv = schema.parse({
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})
