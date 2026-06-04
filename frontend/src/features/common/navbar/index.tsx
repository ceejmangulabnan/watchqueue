import NavLinks from '@/features/common/navbar/nav-links'
import SearchBar from '@/features/search/components/search-bar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

const Navbar = () => {
    return (
        <div className="flex shrink-0 items-center justify-center px-4 py-3 text-md font-medium shadow-md bg-background font-jetbrains-mono">
            <div className="w-full flex justify-between items-center">
                <div className="mr-6 flex items-center gap-2">
                    <SidebarTrigger />
                    <Separator
                        orientation="vertical"
                        className="h-5 mx-1 bg-foreground/20"
                    />
                    <NavLinks />
                </div>
                <div className="flex items-center gap-2">
                    <SearchBar />
                </div>
            </div>
        </div>
    )
}

export default Navbar
