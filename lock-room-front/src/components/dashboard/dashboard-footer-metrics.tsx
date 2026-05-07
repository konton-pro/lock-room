import { formatDateTime } from './dashboard-utils'

type DashboardFooterMetricsProps = {
  totalItems: number
  latestCreatedAt: string | null
}

export const DashboardFooterMetrics = ({
  totalItems,
  latestCreatedAt,
}: DashboardFooterMetricsProps) => (
  <div className="flex items-center justify-between gap-2 flex-wrap">
    <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
      TOTAL_KEYS: {String(totalItems).padStart(2, '0')}
    </span>
    <span className="label-tag" style={{ color: 'var(--text-muted)' }}>
      LATEST_ENTRY: {formatDateTime(latestCreatedAt)}
    </span>
  </div>
)
