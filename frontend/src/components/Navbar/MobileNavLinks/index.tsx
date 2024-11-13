import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Home, Menu, LogOut, UserPen, Settings } from 'lucide-react'

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
          {loading &&
            (
              // Render skeleton while fetching updated auth state
              <ul className='flex-col items-center space-y-3 pt-4'>
                <li><Skeleton className="h-9 w-16" /></li>
                <li><Skeleton className="h-9 w-16" /></li>
                <li><Skeleton className="h-9 w-16" /></li>
              </ul>
            )
          }
          <ul className='flex-col items-center space-y-2 pt-4'>
            <li className='flex items-center gap-2'>
              <Home size={20} />
              <Link to='/'>Home</Link>
            </li>
            {isAuthed ? (
              <>
                <DropdownMenuSeparator />
                <li className='flex items-center gap-2'>
                  <UserPen size={20} />
                  <Link to='/profile'>Profile</Link>
                </li>
                <li className='flex items-center gap-2'>
                  <Settings size={20} />
                  <Link to='/settings'>Settings</Link>
                </li>
                <DropdownMenuSeparator />
                <li onClick={handleLogout} className='flex gap-2 items-center'>
                  <LogOut size={20} />
                  LogOut
                </li>
              </>
            ) : (
              <>
                <DropdownMenuSeparator />
                <li>
                  <LoginRegisterToggle />
                </li>
              </>
            )}
          </ul>
        </SheetContent>
      </Sheet>
    </nav >
  )
}

export default MobileNavLinks
