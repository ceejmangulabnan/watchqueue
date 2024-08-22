import { Link } from 'react-router-dom'
import './navbar.scss'
import LoginRegisterToggle from '../LoginRegisterToggle/LoginRegisterToggle'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useAuth } from '../../hooks/useAuth'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import { useEffect } from 'react'

const Navbar = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth, setAuth } = useAuth()
  const { isLoggedIn, setIsLoggedIn } = useIsLoggedIn()

  // Logout Function
  const handleLogout = async () => {
    const response = await axiosPrivate.post("/users/logout")

    if (response.status == 200) {
      setAuth({
        ...auth,
        username: null,
        id: null,
        accessToken: null
      })
      setIsLoggedIn(false)
    }
  }

  // Check if user is logged in
  useEffect(() => {
    const checkAuthValues = () => {
      // Check auth values if not null
      if (auth && !Object.values(auth).includes(null)) {
        setIsLoggedIn(true)
      }
    }

    checkAuthValues()
  }, [auth])

  return (
    <div className='navbar'>
      <h1 className='navbar__title'>watchqueue</h1>
      <nav className='navbar__links'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <LoginRegisterToggle />
          </li>
          {
            isLoggedIn ?
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
              : <div></div>
          }
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
