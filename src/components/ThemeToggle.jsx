import { themeChange } from 'theme-change'
import { useEffect, useState } from 'react'
import daisyuiThemes from 'styles/daisyui-themes.json'

const themes = Object.keys(daisyuiThemes) || ['']
export const defaultTheme = themes[0] // phoenixDark

function ThemeToggle() {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    themeChange(false)
    const currentTheme = document.documentElement.getAttribute('data-theme')
    if (!currentTheme) {
      document.documentElement.setAttribute('data-theme', defaultTheme)
    }
    setTheme(currentTheme || defaultTheme)
  }, [])

  const handleToggle = () => {
    const newTheme = theme === themes[0] ? themes[1] : themes[0]
    document.documentElement.setAttribute('data-theme', newTheme)
    setTheme(newTheme)
  }

  return (
    <div className="form-control lg:mr-4 md:ml-auto">
      <label className="cursor-pointer label">
        <span className="label-text">🌚&nbsp;</span>
        <input
          type="checkbox"
          className="toggle toggle-secondary mx-1"
          checked={theme === themes[1]}
          onChange={handleToggle}
        />
        <span className="label-text">🌞</span>
      </label>
    </div>
  )
}

export default ThemeToggle
