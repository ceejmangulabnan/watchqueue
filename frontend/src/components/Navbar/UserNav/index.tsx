import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserNavProps {
  loading: boolean
  isAuthed: boolean
  handleLogout: () => Promise<void>
}
const UserNav = ({ loading, isAuthed, handleLogout }: UserNavProps) => {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger className={isAuthed ? '' : 'hidden'}>
        <Avatar>
          <AvatarImage></AvatarImage>
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        <ul className='flex-col items-center space-y-3 pt-4'>
          <li>
            <Link to='/profile'>Profile</Link>
          </li>
          <li>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </li>
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserNav
