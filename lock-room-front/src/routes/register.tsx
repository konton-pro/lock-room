import { createFileRoute, redirect } from '@tanstack/react-router'
import { RegisterForm } from '@/components/register/register-form'
import { authStore } from '@/stores/auth-store'

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    if (authStore.isAuthenticated()) throw redirect({ to: '/dashboard' })
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
