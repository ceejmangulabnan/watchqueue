import {
    Sidebar,
    SidebarHeader,
    SidebarMenu,
    SidebarContent,
    SidebarMenuItem,
    SidebarFooter,
    SidebarGroup,
    SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Compass, Home, Popcorn } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from '../components/theme-toggle'

const AppSidebar = () => {
    const { pathname } = useLocation()

    const navLinks = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/browse', label: 'Browse', icon: Compass },
        { to: '/watchlists', label: 'Watchlists', icon: Popcorn },
    ]

    const isActive = (path: string) =>
        path === '/' ? pathname === '/' : pathname.startsWith(path)

    const activeClass =
        '!bg-red-700 !text-white hover:!bg-red-700 hover:!text-white hover:!opacity-100 py-6 text-lg'

    return (
        <Sidebar>
            <SidebarHeader className="font-bebas-neue text-red-700 text-4xl py-16 pl-4 leading-none gap-0">
                watchqueue
                <span className="font-jetbrains-mono font-bold uppercase text-sm tracking-tight text-gray-500">
                    watchlist tracking
                </span>
            </SidebarHeader>
            <SidebarContent className="font-mono">
                <SidebarGroup className="p-0">
                    <SidebarMenu>
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <SidebarMenuItem key={to}>
                                <SidebarMenuButton
                                    asChild
                                    className={
                                        (isActive(to) ? activeClass : '') +
                                        'py-6 px-4 rounded-none font-bold'
                                    }
                                >
                                    <Link
                                        to={to}
                                        className="flex gap-4 items-center"
                                    >
                                        <Icon size={24} />
                                        {label}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <ThemeToggle></ThemeToggle>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar
