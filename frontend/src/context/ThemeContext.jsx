import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {}
})

export const ThemeProvider = ({ children }) => {
  // Default to 'dark' when entering, but persist choice if user manually toggles
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('rb-theme')
    return saved === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
      document.body.classList.remove('dark-theme')
      document.body.classList.add('light-theme')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
      document.body.classList.remove('light-theme')
      document.body.classList.add('dark-theme')
    }
    localStorage.setItem('rb-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme) => {
    setThemeState(newTheme === 'light' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
export default ThemeContext
