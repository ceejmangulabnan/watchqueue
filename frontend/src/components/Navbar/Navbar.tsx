import { Link } from 'react-router-dom'
import './navbar.scss'
import LoginRegisterToggle from '../LoginRegisterToggle/LoginRegisterToggle'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useEffect, useLayoutEffect, useState } from 'react'
import LogoutButton from '../LogoutButton'
import { useAuth } from '../../hooks/useAuth'
import useRefreshUser from '../../hooks/useRefreshUser'

const Navbar = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth, setAuth } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const refreshUser = useRefreshUser()

  useLayoutEffect(() => {
    refreshUser()
  }, [])

  // Check if user is logged in
  useEffect(() => {
    const checkUserData = async () => {
      // Check userData values if not null
      if (auth && !Object.values(auth).includes(null)) {
        setIsLoggedIn(true)
        console.log('User is logged in')
      }
    }


    checkUserData()
  }, [auth])

  // Logout Function
  const handleLogout = async () => {
    const response = await axiosPrivate.post("/users/logout")
    if (response.status == 200) {
      setAuth({ ...auth, id: null, username: null, accessToken: null })
    }
    console.log(response)

  }

  return (
    <div className='navbar'>
      <h1 className='navbar__title'>watchqueue</h1>
      <nav className='navbar__links'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          {
            isLoggedIn ?
              (
                <>
                  <li>
                    <Link to='/profile'>Profile</Link>
                  </li>
                  <li>
                    <LogoutButton onClick={handleLogout} />
                  </li>
                </>
              )
              : (
                <li>
                  <LoginRegisterToggle />
                </li>
              )
          }
        </ul>
      </nav>
    </div >
  )
}

export default Navbar
