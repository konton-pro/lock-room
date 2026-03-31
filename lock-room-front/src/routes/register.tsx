import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@/components/register/register-form'

export const Route = createFileRoute('/register')({ component: RegisterPage })

function RegisterPage() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <RegisterForm />
    </main>
  )
}
