import daisyui from 'daisyui'
import themes from './src/styles/daisyui-themes.json' assert { type: 'json' }

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [themes],
    base: true,
    styled: true,
    utils: true,
  },
}
