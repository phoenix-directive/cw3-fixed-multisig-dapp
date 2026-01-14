import { Link } from 'react-router-dom'

interface ProposalCardProps {
  title: string
  id: string
  multisigAddress: string
  status: string
  expires_at: number
}

const icons = {
  bell: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className="flex-shrink-0 w-6 h-6 ml-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      ></path>
    </svg>
  ),
  info: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="w-6 h-6 ml-2 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  ),
  warning: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="w-6 h-6 ml-2 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      ></path>
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="w-6 h-6 ml-2 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      ></path>
    </svg>
  ),
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="w-6 h-6 ml-2 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      ></path>
    </svg>
  ),
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
    passed: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
    rejected: 'border-red-500 bg-red-50 dark:bg-red-900/10',
    executed: 'border-green-500 bg-green-50 dark:bg-green-900/10',
    open: 'border-primary bg-primary/5',
  }

  const statusIconColors = {
    passed: 'text-yellow-600 dark:text-yellow-400',
    rejected: 'text-red-600 dark:text-red-400',
    executed: 'text-green-600 dark:text-green-400',
    open: 'text-primary',
  }

  return (
    <Link to={`/${encodeURIComponent(multisigAddress)}/${id}`}>
      <div
        className={`rounded-xl shadow-lg hover:shadow-xl mb-4 border-2 transition-all ${statusColors[status as keyof typeof statusColors] || statusColors.open}`}
        title={`Expires at ${expiresAtDateTime}`}
      >
        <div className="py-4 px-8">
          <div className="flex flex-row justify-between items-center m-0">
            <div className="text-lg font-semibold text-foreground">{title}</div>
            {status === 'passed' && (
              <div className={`text-2xl ${statusIconColors.passed}`}>
                {icons.warning}
              </div>
            )}
            {status === 'rejected' && (
              <div className={`text-2xl ${statusIconColors.rejected}`}>
                {icons.error}
              </div>
            )}
            {status === 'executed' && (
              <div className={`text-2xl ${statusIconColors.executed}`}>
                &#x2713;
              </div>
            )}
            {status === 'open' && (
              <div className={`text-2xl ${statusIconColors.open}`}>
                {icons.bell}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
