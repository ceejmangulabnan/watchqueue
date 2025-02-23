import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Home, Menu, LogOut, UserPen, Settings } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import { ThemeToggle } from '@/components/ThemeToggle'

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
          <Menu className='ml-4' />
        </SheetTrigger>
        <SheetContent className='text-md font-medium flex flex-col justify-between'>
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
            <li className='my-3'>
              <SearchBar />
            </li>

            <DropdownMenuSeparator />
            <li className='flex items-center gap-2 p-1'>
              <Home size={20} />
              <Link to='/'>Home</Link>
            </li>
            {isAuthed ? (
              <div className='flex flex-col gap-2'>
                <DropdownMenuSeparator />
                <li className='flex items-center gap-2 p-1'>
                  <UserPen size={20} />
                  <Link to='/profile'>Profile</Link>
                </li>
                <li className='flex items-center gap-2 p-1'>
                  <Settings size={20} />
                  <Link to='/settings'>Settings</Link>
                </li>
                <DropdownMenuSeparator />
                <li onClick={handleLogout} className='flex gap-2 items-center p-1 text-red-500'>
                  <LogOut size={20} />
                  Log out
                </li>
              </div>
            ) : (
              <>
                <DropdownMenuSeparator />
                <li>
                  <LoginRegisterToggle />
                </li>
              </>
            )}
          </ul>

          <div className='flex justify-end mt-auto'>
            <ThemeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </nav >
  )
}

export default MobileNavLinks
