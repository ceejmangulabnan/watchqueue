import { LogOut, UserPen, Settings, ChevronDown } from 'lucide-react'
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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface UserNavProps {
  loading: boolean
  isAuthed: boolean
  handleLogout: () => Promise<void>
  auth: Auth
}

const UserNav = ({ loading, isAuthed, handleLogout, auth }: UserNavProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const generateAvatarFallback = () => {
    if (isAuthed) {
      return auth.username?.charAt(0)
    }
  }

  return (
    <div className='flex ml-4 items-center'>
      <Avatar className={`${isAuthed ? 'flex' : 'hidden'} cursor-pointer`} onClick={() => navigate('/profile')}>
        <AvatarImage></AvatarImage>
        <AvatarFallback>{generateAvatarFallback()}</AvatarFallback>
      </Avatar>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={(isAuthed ? 'hidden md:flex ' : 'hidden ') + 'ml-2 items-center justify-center hover:bg-gray-100 rounded-full w-6 h-6'}>
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40 mr-4 mt-4 flex justify-center'>
          {loading ? (
            <ul className='flex-col items-center pt-4'>
              <li><Skeleton className="h-9 w-16" /></li>
              <li><Skeleton className="h-9 w-16" /></li>
              <li><Skeleton className="h-9 w-20" /></li>
            </ul>
          ) : isAuthed ? (
            <ul className='flex-col items-center text-md font-medium w-full'>
              <DropdownMenuItem>
                <li className='flex items-center gap-2'>
                  <UserPen size={20} />
                  <Link to='/profile' onClick={() => setIsOpen(false)}>Profile</Link>
                </li>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <li className='flex items-center gap-2'>
                  <Settings size={20} />
                  <Link to='/settings' onClick={() => setIsOpen(false)}>Settings</Link>
                </li>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <li onClick={async () => { await handleLogout(); setIsOpen(false); }} className='flex gap-2 items-center text-red-500'>
                  <LogOut size={20} color='red' />
                  Log out
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
    </div>
  )
}

export default UserNav
