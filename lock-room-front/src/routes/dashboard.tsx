import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { hasActiveSession } from '@/lib/session'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context }) => {
    const authenticated = await hasActiveSession(context.queryClient)
    if (!authenticated) throw redirect({ to: '/login' })
  },
  component: DashboardPage,
})
