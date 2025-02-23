import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import NavLinks from '@/components/Navbar/NavLinks'
import UserNav from '@/components/Navbar/UserNav'
import SearchBar from '@/components/SearchBar'
import { ThemeToggle } from '@/components/ThemeToggle'
import MobileNavLinks from '@/components/Navbar/MobileNavLinks'

const Navbar = () => {
  const { auth, isAuthLoading, logout } = useAuth()
  const isAuthed = auth && !Object.values(auth).includes(null)

  return (
    <div className='z-50 fixed top-0 left-0 right-0 flex items-center justify-center px-10 md:px-20 py-3 text-md font-medium shadow-md bg-background'>
      <div className='w-full 2xl:max-w-[1600px] flex justify-between items-center'>
        <div className='mr-6'>
          <Link to='/'>
            <h1 className='hidden md:block text-xl  md:text-2xl font-semibold'>watchqueue</h1>
            <h1 className='text-2xl md:hidden font-bold'>wq</h1>
          </Link>
        </div>
        <SearchBar />
        <div className='flex items-center gap-2'>
          <NavLinks loading={isAuthLoading} isAuthed={isAuthed} handleLogout={logout} />
          <UserNav loading={isAuthLoading} isAuthed={isAuthed} handleLogout={logout} auth={auth} />
          <div className='hidden md:block'>
            <ThemeToggle />
          </div>
          <MobileNavLinks loading={isAuthLoading} isAuthed={isAuthed} handleLogout={logout} />
        </div>
      </div>
    </div>
  )
}

export default Navbar
