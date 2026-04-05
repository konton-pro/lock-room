import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardPage } from '@/components/dashboard/dashboard-page'
import { authStore } from '@/stores/auth-store'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    if (!authStore.isAuthenticated()) throw redirect({ to: '/login' })
  },
  component: DashboardPage,
})
