import { createFileRoute } from '@tanstack/react-router'
import { RecoverForm } from '@/components/recover/recover-form'

export const Route = createFileRoute('/recover')({ component: RecoverPage })

function RecoverPage() {
  return (
    <main style={{ position: 'relative', zIndex: 1 }}>
      <RecoverForm />
    </main>
  )
}
