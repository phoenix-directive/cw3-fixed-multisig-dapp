import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if dark mode is already set
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const handleToggle = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="flex items-center lg:mr-4 md:ml-auto">
      <label className="flex items-center cursor-pointer">
        <Sun className="mr-2 h-5 w-5" />
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={isDark}
            onChange={handleToggle}
          />
          <div
            className={`block w-14 h-8 rounded-full transition ${isDark ? 'bg-primary' : 'bg-muted'}`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${isDark ? 'transform translate-x-6' : ''}`}
          ></div>
        </div>
        <Moon className="ml-2 h-5 w-5" />
      </label>
    </div>
  )
}

export default ThemeToggle
