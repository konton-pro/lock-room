import type { VaultListItem } from '@/services/vault'

export const formatDateTime = (isoDate: string | null): string => {
  if (!isoDate) return 'N/A'
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export const getLatestCreatedAt = (items: VaultListItem[]): string | null => {
  if (items.length === 0) return null

  return items.reduce<string | null>((latest, item) => {
    if (!latest) return item.createdAt
    return new Date(item.createdAt).getTime() > new Date(latest).getTime() ? item.createdAt : latest
  }, null)
}
