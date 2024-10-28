import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'
import { LogOut, UserPen, Settings } from 'lucide-react'

interface UserNavProps {
  loading: boolean
  isAuthed: boolean
  handleLogout: () => Promise<void>
}
const UserNav = ({ loading, isAuthed, handleLogout }: UserNavProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'hidden md:flex ml-4' + (isAuthed ? '' : 'hidden')}>
        <Avatar>
          <AvatarImage></AvatarImage>
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {loading ? (
          <ul className='flex-col items-center pt-4'>
            <li><Skeleton className="h-9 w-16" /></li>
            <li><Skeleton className="h-9 w-16" /></li>
            <li><Skeleton className="h-9 w-20" /></li>
          </ul>
        ) : isAuthed ? (
          <ul className='flex-col items-center text-md font-medium'>
            <DropdownMenuItem>
              <li className='flex items-center gap-2'>
                <UserPen size={20} />
                <Link to='/profile'>Profile</Link>
              </li>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <li className='flex items-center gap-2'>
                <Settings size={20} />
                <Link to='/settings'>Settings</Link>
              </li>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <li onClick={handleLogout} className='flex gap-2 items-center'>
                <LogOut size={20} />
                LogOut
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
