import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuth } from '@/hooks/useAuth'
import useRefreshUser from '@/hooks/useRefreshUser'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const Navbar = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth, setAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const refreshUser = useRefreshUser()
  const navigate = useNavigate()

  useEffect(() => {
    const initAuthCheck = async () => {
      try {
        await refreshUser()
      } catch (error) {
        console.error("Error refreshing user data", error)
      } finally {
        setLoading(false)
      }
    }
    initAuthCheck()
  }, [refreshUser])

  const handleLogout = async () => {
    const response = await axiosPrivate.post("/users/logout")
    if (response.status == 200) {
      setAuth({ ...auth, id: null, username: null, accessToken: null })
      navigate("/", { replace: true })
    }
  }

  const isAuthed = auth && !Object.values(auth).includes(null)

  return (
    <div className='z-10 fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-3 text-md font-medium shadow-md bg-white'>
      <Link to='/'>
        <h1 className='text-2xl font-semibold'>watchqueue</h1>
      </Link>
      <nav>
        {loading ? (
          // Render skeleton while fetching updated auth state
          <ul className='flex items-center gap-3'>
            <li><Skeleton className="h-9 w-16" /></li>
            <li><Skeleton className="h-9 w-16" /></li>
            <li><Skeleton className="h-9 w-20" /></li>
          </ul>
        ) : isAuthed ? (
          // If user is authenticated, show logged-in navigation
          <ul className='flex items-center gap-3'>
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
          <ul className='flex items-center gap-3'>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <LoginRegisterToggle />
            </li>
          </ul>
        )}
      </nav>
    </div>
  )
}

export default Navbar
