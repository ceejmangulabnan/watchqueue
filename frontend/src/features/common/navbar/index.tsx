import { useAuth } from '@/features/auth/hooks/use-auth'
import NavLinks from '@/features/common/navbar/nav-links'
import UserNav from '@/features/common/navbar/user-nav'
import SearchBar from '@/features/search/components/search-bar'
import { ThemeToggle } from '@/features/common/components/theme-toggle'
import MobileNavLinks from '@/features/common/navbar/mobile-nav-links'
import { SidebarTrigger } from '@/components/ui/sidebar'
import LoginRegisterToggle from '@/features/auth/components/login-register-toggle'
import { Separator } from '@/components/ui/separator'

const Navbar = () => {
    const { auth, isAuthLoading, logout } = useAuth()
    const isAuthed = auth && !Object.values(auth).includes(null)

    return (
        <div className="flex shrink-0 items-center justify-center px-10 py-3 text-md font-medium shadow-md bg-background font-jetbrains-mono">
            <div className="w-full flex justify-between items-center">
                <div className="mr-6 flex items-center gap-2">
                    <SidebarTrigger />
                    <Separator
                        orientation="vertical"
                        className="h-5 mx-1 bg-foreground/20"
                    />
                    <NavLinks loading={isAuthLoading} handleLogout={logout} />
                </div>
                <div className="flex items-center gap-2">
                    <SearchBar />
                    <UserNav
                        loading={isAuthLoading}
                        isAuthed={isAuthed}
                        handleLogout={logout}
                        auth={auth}
                    />
                    {!isAuthed && <LoginRegisterToggle />}
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>
                    <MobileNavLinks
                        loading={isAuthLoading}
                        isAuthed={isAuthed}
                        handleLogout={logout}
                    />
                </div>
            </div>
        </div>
    )
}

export default Navbar
