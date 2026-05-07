import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/login/login-form'
import { hasActiveSession } from '@/lib/session'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const authenticated = await hasActiveSession(context.queryClient)
    if (authenticated) throw redirect({ to: '/dashboard' })
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <LoginForm />
    </main>
  )
}
