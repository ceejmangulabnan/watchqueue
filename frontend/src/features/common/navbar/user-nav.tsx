import { LogOut, UserPen, Settings, ChevronRight } from 'lucide-react'
import { Auth } from '@/features/auth/context/auth-provider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import LoginRegisterToggle from '@/features/auth/components/login-register-toggle'
import { useState } from 'react'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

interface UserNavProps {
    loading: boolean
    isAuthed: boolean
    handleLogout: () => Promise<void>
    auth: Auth
}

const UserNav = ({ loading, isAuthed, handleLogout, auth }: UserNavProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const generateAvatarFallback = () => {
        if (isAuthed) {
            return auth.username?.charAt(0)
        }
    }

    return (
        <SidebarMenu>
            {auth && isAuthed ? (
                <SidebarMenuItem>
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger
                            asChild
                            className={isAuthed ? 'flex ' : 'hidden '}
                        >
                            <SidebarMenuButton
                                className="flex justify-between"
                                size="lg"
                            >
                                <div className="flex gap-2 items-center">
                                    <Avatar
                                        className={`${isAuthed ? 'flex' : 'hidden'} cursor-pointer`}
                                    >
                                        <AvatarImage></AvatarImage>
                                        <AvatarFallback>
                                            {generateAvatarFallback()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <p>{auth.username}</p>
                                </div>
                                <ChevronRight />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="right"
                            className="w-40 mr-4 flex justify-center"
                        >
                            {loading ? (
                                <ul className="flex-col items-center pt-4">
                                    <li>
                                        <Skeleton className="h-9 w-16" />
                                    </li>
                                    <li>
                                        <Skeleton className="h-9 w-16" />
                                    </li>
                                    <li>
                                        <Skeleton className="h-9 w-20" />
                                    </li>
                                </ul>
                            ) : isAuthed ? (
                                <ul className="flex-col items-center text-md font-medium w-full">
                                    <DropdownMenuItem>
                                        <li className="flex items-center gap-2">
                                            <UserPen size={20} />
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                        </li>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <li className="flex items-center gap-2">
                                            <Settings size={20} />
                                            <Link
                                                to="/settings"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Settings
                                            </Link>
                                        </li>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <li
                                            onClick={async () => {
                                                await handleLogout()
                                                setIsOpen(false)
                                            }}
                                            className="flex gap-2 items-center text-red-500"
                                        >
                                            <LogOut size={20} color="red" />
                                            Log out
                                        </li>
                                    </DropdownMenuItem>
                                </ul>
                            ) : (
                                <LoginRegisterToggle />
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            ) : (
                <SidebarMenuItem className="p-0">
                    <LoginRegisterToggle />
                </SidebarMenuItem>
            )}
        </SidebarMenu>
    )
}

export default UserNav
