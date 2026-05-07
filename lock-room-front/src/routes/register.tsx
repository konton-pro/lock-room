import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterForm } from '@/components/register/register-form'
import { hasActiveSession } from '@/lib/session'

export const Route = createFileRoute('/register')({
  beforeLoad: async ({ context }) => {
    const authenticated = await hasActiveSession(context.queryClient)
    if (authenticated) throw redirect({ to: '/dashboard' })
  },
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <RegisterForm />
    </main>
  )
}
