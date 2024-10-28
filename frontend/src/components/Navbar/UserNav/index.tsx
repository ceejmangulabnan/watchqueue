import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'

interface UserNavProps {
  loading: boolean
  isAuthed: boolean
  handleLogout: () => Promise<void>
}
const UserNav = ({ loading, isAuthed, handleLogout }: UserNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'hidden md:flex' + (isAuthed ? '' : 'hidden')}>
        <Avatar>
          <AvatarImage></AvatarImage>
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {loading ? (
          <ul className='flex-col items-center space-y-3 pt-4'>
            <li><Skeleton className="h-9 w-16" /></li>
          </ul>
        ) : isAuthed ? (
          <ul className='flex-col items-center space-y-3 pt-4 text-md font-medium'>
            <DropdownMenuItem>
              <li>
                <Link to='/profile'>Profile</Link>
              </li>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <li>
                <Link to='/settings'>Settings</Link>
              </li>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <li>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
              </li>
            </DropdownMenuItem>
          </ul>
        ) : (
          <ul className='flex-col items-center space-y-3 pt-4'>
            <li>
              <LoginRegisterToggle />
            </li>
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserNav
