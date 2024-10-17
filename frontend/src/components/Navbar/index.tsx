import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuth } from '@/hooks/useAuth'
import useRefreshUser from '@/hooks/useRefreshUser'
import LoginRegisterToggle from '@/components/LoginRegisterToggle'
import { Button } from '@/components/ui/button'

const Navbar = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth, setAuth } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const refreshUser = useRefreshUser()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    refreshUser()
  }, [refreshUser])

  useEffect(() => {
    const checkUserData = async () => {
      // Check userData values if not null
      if (auth && !Object.values(auth).includes(null)) {
        setIsLoggedIn(true)
      }
    }
    checkUserData()
  }, [auth])

  const handleLogout = async () => {
    const response = await axiosPrivate.post("/users/logout")
    if (response.status == 200) {
      setAuth({ ...auth, id: null, username: null, accessToken: null })
      setIsLoggedIn(false)
      navigate("/", { replace: true })
    }
  }

  return (
    <div className='z-10 fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-3 text-md font-medium shadow-md bg-white'>
      <Link to='/'>
        <h1 className='text-2xl font-semibold'>watchqueue</h1>
      </Link>
      <nav>
        <ul className='flex items-center gap-3'>
          {
            isLoggedIn ? (
              <ul className='flex items-center gap-3'>
                <li>
                  <Link to='/'>Home</Link>
                </li>
                <li>
                  <Link to='/profile'>Profile</Link>
                </li>
                <li>
                  <Button variant={"destructive"} onClick={handleLogout}>Logout</Button>
                </li>
              </ul>
            ) : (
              <ul className='flex items-center gap-3'>
                <li>
                  <Link to='/'>Home</Link>
                </li>
                <li>
                  <LoginRegisterToggle />
                </li>
              </ul>
            )
          }
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
