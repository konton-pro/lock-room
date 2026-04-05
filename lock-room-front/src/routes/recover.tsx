import { createFileRoute, redirect } from '@tanstack/react-router'
import { RecoverForm } from '@/components/recover/recover-form'
import { authStore } from '@/stores/auth-store'

export const Route = createFileRoute('/recover')({
  beforeLoad: () => {
    if (authStore.isAuthenticated()) throw redirect({ to: '/dashboard' })
  },
  component: RecoverPage,
})

function RecoverPage() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <RecoverForm />
    </main>
  )
}
