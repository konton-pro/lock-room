import { createFileRoute, redirect } from '@tanstack/react-router'
import { RecoverForm } from '@/components/recover/recover-form'
import { hasActiveSession } from '@/lib/session'

export const Route = createFileRoute('/recover')({
  beforeLoad: async ({ context }) => {
    const authenticated = await hasActiveSession(context.queryClient)
    if (authenticated) throw redirect({ to: '/dashboard' })
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
