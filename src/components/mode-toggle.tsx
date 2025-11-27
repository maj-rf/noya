import { MoonStar, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme-provider'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      aria-label="toggle-theme"
      variant="ghost"
      size="icon-sm"
      onClick={() => {
        return theme === 'dark' ? setTheme('light') : setTheme('dark')
      }}
    >
      <Sun className="text-common rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <MoonStar className="absolute text-rare rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
