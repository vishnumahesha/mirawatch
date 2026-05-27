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

  async function handleSubmit(e: { preventDefault(): void }) {
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
        {loading ? 'Sending...' : 'Send magic link'}
      </Button>
    </form>
  )
}
