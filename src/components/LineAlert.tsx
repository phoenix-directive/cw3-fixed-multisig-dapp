const icons = {
  success: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="flex-shrink-0 w-5 h-5 mx-2 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      ></path>
    </svg>
  ),
  error: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className="w-5 h-5 mx-2 stroke-current flex-shrink-0"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      ></path>
    </svg>
  ),
}

function LineAlert({
  variant,
  msg,
  className = '',
}: {
  variant: 'success' | 'error'
  msg: string
  className?: string
}) {
  const bgColor =
    variant === 'success'
      ? 'bg-green-500/5 border-green-500/30'
      : 'bg-red-500/5 border-red-500/30'
  const textColor =
    variant === 'success'
      ? 'text-green-700 dark:text-green-300'
      : 'text-red-700 dark:text-red-300'

  return (
    <div
      className={`flex items-center p-3 rounded-lg border ${bgColor} ${textColor} ${className}`}
    >
      <div className="flex items-center flex-1">
        {icons[variant]}
        <label className="flex-grow break-all text-center ml-2 text-sm">
          {msg}
        </label>
      </div>
    </div>
  )
}

export default LineAlert
