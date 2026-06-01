import { Suspense } from 'react'
import LoginForm from './LoginForm'

export const metadata = { title: 'Sign in — Mirage' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Sign in to Mirage</h1>
          <p className="text-gray-400 text-sm">Enter your email to receive a sign-in code</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
