import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'

interface NavLinksProps {
  loading: boolean
  isAuthed: boolean
  handleLogout: () => Promise<void>
}

const NavLinks = ({ loading, isAuthed, handleLogout }: NavLinksProps) => {
  return (
    <nav className='hidden md:flex'>
      {loading ? (
        // Render skeleton while fetching updated auth state
        <ul className='flex items-center gap-3'>
          <li><Skeleton className="h-9 w-16" /></li>
          <li><Skeleton className="h-9 w-16" /></li>
          <li><Skeleton className="h-9 w-20" /></li>
        </ul>
      ) : isAuthed ? (
        // If user is authenticated, show logged-in navigation
        <ul className='flex items-center gap-3'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/profile'>Profile</Link>
          </li>
          <li>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </li>
        </ul>
      ) : (
        // If not authed, show login button
        <ul className='flex items-center gap-3'>
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
