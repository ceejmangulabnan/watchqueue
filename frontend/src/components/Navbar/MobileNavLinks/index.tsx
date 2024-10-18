import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

interface MobileNavLinksProps {
  loading: boolean
  isAuthed: boolean
  handleLogout: () => Promise<void>
}

const MobileNavLinks = ({ loading, isAuthed, handleLogout }: MobileNavLinksProps) => {
  return (

    <nav className='md:hidden'>
      <Sheet>
        <SheetTrigger asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent className='text-md font-medium'>
          {loading ? (
            // Render skeleton while fetching updated auth state
            <ul className='flex-col items-center space-y-3 pt-4'>
              <li><Skeleton className="h-9 w-16" /></li>
              <li><Skeleton className="h-9 w-16" /></li>
              <li><Skeleton className="h-9 w-20" /></li>
            </ul>
          ) : isAuthed ? (
            // If user is authenticated, show logged-in navigation
            <ul className='flex-col items-center space-y-3 pt-4'>
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
            <ul className='flex-col items-center space-y-3 pt-4'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <LoginRegisterToggle />
              </li>
            </ul>
          )}

        </SheetContent>



      </Sheet>

    </nav>
  )
}

export default MobileNavLinks
