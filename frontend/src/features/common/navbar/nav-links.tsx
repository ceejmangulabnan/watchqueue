import { Link } from 'react-router-dom'

const navLinks = [
    { to: '/browse/movies', label: 'Movies' },
    { to: '/browse/tv', label: 'TV' },
    { to: '/watchlists', label: 'Watchlists' },
]

const NavLinks = () => {
    return (
        <nav className="hidden md:flex text-sm md:text-base">
            <ul className="flex items-center gap-6 text-sm font-bold ml-4">
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
