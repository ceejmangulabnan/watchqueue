import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'

interface NavLinksProps {
  loading: boolean
  isAuthed: boolean
  handleLogout: () => Promise<void>
}

const NavLinks = ({ loading, isAuthed }: NavLinksProps) => {
  return (
    <nav className='md:flex text-sm md:text-base ml-6'>
      {loading ? (
        // Render skeleton while fetching updated auth state
        <ul className='flex items-center gap-3'>
          <li><Skeleton className="h-9 w-16" /></li>
        </ul>
      ) : isAuthed ? (
        // If user is authenticated, show logged-in navigation
        <ul className='flex items-center gap-3'>
          <li>
            <Link to='/'>Home</Link>
          </li>
        </ul>
      ) : (
        // If not authed, show login button
        <ul className='flex items-center justify-between gap-3'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <LoginRegisterToggle />
          </li>
        </ul>
      )}
    </nav>
  )
}

export default NavLinks
