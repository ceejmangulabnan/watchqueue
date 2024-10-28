import { LogOut, UserPen, Settings } from 'lucide-react'
import { Auth } from '@/contexts/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'

interface UserNavProps {
  loading: boolean
  isAuthed: boolean
  handleLogout: () => Promise<void>
  auth: Auth
}

const UserNav = ({ loading, isAuthed, handleLogout, auth }: UserNavProps) => {

  const generateAvatarFallback = () => {
    if (isAuthed) {
      return auth.username?.charAt(0)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'hidden md:flex ml-4' + (isAuthed ? '' : 'hidden')}>
        <Avatar>
          <AvatarImage></AvatarImage>
          <AvatarFallback>{generateAvatarFallback()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='px-4 py-2 mr-4 mt-4'>
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
            <DropdownMenuSeparator />
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
