import { Link } from 'react-router-dom'

interface ProposalCardProps {
  title: string
  id: string
  multisigAddress: string
  status: string
  expires_at: number
}

export default function ProposalCard({
  title,
  id,
  multisigAddress,
  status,
  expires_at,
}: ProposalCardProps) {
  const expiresAtDateTime = new Date(expires_at / 1000000).toLocaleString()

  const statusColors = {
    passed: 'border-yellow-500/30 bg-yellow-500/5',
    rejected: 'border-red-500/30 bg-red-500/5',
    executed: 'border-green-500/30 bg-green-500/5',
    open: 'border-border bg-card',
  }

  const statusIconColors = {
    passed: 'text-yellow-600 dark:text-yellow-400',
    rejected: 'text-red-600 dark:text-red-400',
    executed: 'text-green-600 dark:text-green-400',
    open: 'text-primary',
  }

  const statusLabels = {
    passed: 'Passed',
    rejected: 'Rejected',
    executed: 'Executed',
    open: 'Open',
  }

  return (
    <Link to={`/${encodeURIComponent(multisigAddress)}/${id}`}>
      <div
        className={`rounded-lg border p-4 mb-3 transition-all hover:border-primary hover:shadow-md ${statusColors[status as keyof typeof statusColors] || statusColors.open}`}
        title={`Expires at ${expiresAtDateTime}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <div className="text-sm font-medium text-foreground">{title}</div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${statusIconColors[status as keyof typeof statusIconColors]}`}
            >
              {statusLabels[status as keyof typeof statusLabels] || 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
