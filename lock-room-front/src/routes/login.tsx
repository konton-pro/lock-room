import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/login/login-form'
import { authStore } from '@/stores/auth-store'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (authStore.isAuthenticated()) throw redirect({ to: '/dashboard' })
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
