import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/nav/Nav'
import { createClient } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mirage',
  description: 'Mirage — movies and TV, on demand.',
  openGraph: {
    title: 'Mirage',
    description: 'Mirage — movies and TV, on demand.',
  },
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
