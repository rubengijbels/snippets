import React, { createContext, useContext, useEffect, useState } from 'react'
import { isServer } from './functions'

export const useTailwindDarkMode = () => {
  const localStorageTheme = isServer() ? 'light' : localStorage.getItem('theme')
  const [theme, setTheme] = useState(localStorageTheme as string)
  const toggle = () => setTheme(theme == 'dark' ? 'light' : 'dark')

  useEffect(() => {
    localStorage.setItem('theme', theme)
    const htmlEl = document.querySelector('html')
    if (theme == 'dark') htmlEl?.classList.add('dark')
    else htmlEl?.classList.remove('dark')
  }, [theme])

  return { theme, toggle }
}

interface IThemeContext {
  theme: string
  toggle: () => void
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined)

interface IThemeProviderProps {
  children?: React.ReactNode
}

export const ThemeProvider = ({ children }: IThemeProviderProps) => {
  const { theme, toggle } = useTailwindDarkMode()

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const withThemeProvider = (children: JSX.Element): JSX.Element => <ThemeProvider>{children}</ThemeProvider>

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context == null) throw new Error('useThemeContext must be used within ThemeProvider')
  return context
}
