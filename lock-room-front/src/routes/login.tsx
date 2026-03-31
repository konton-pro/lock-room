import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/login/login-form'

export const Route = createFileRoute('/login')({ component: LoginPage })

function LoginPage() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <LoginForm />
    </main>
  )
}
