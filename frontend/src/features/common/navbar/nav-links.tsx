import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

interface NavLinksProps {
    loading: boolean
    handleLogout: () => Promise<void>
}

const navLinks = [
    { to: '/browse/movies', label: 'Movies' },
    { to: '/browse/tv', label: 'TV' },
    { to: '/watchlists', label: 'Watchlists' },
]

const NavLinks = ({ loading }: NavLinksProps) => {
    return (
        <nav className="hidden md:flex text-sm md:text-base">
            <ul className="flex items-center gap-6 text-sm font-bold ml-4">
                {loading && (
                    <li>
                        <Skeleton className="h-9 w-16"></Skeleton>
                    </li>
                )}
                {navLinks.map(({ to, label }) => (
                    <Link
                        key={to}
                        to={to}
                        className="hover:underline underline-offset-2"
                    >
                        {label}
                    </Link>
                ))}
            </ul>
        </nav>
    )
}

export default NavLinks
