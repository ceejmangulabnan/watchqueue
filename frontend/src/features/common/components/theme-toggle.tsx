import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/features/common/context/theme-provider'
import { SidebarMenuButton } from '@/components/ui/sidebar'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <SidebarMenuButton
            onClick={toggleTheme}
            className="text-sm flex gap-4 items-center mb-2 py-2 px-4 rounded-none font-medium font-mono h-auto"
        >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            {theme === 'light' ? 'Light' : 'Dark'}
        </SidebarMenuButton>
    )
}
