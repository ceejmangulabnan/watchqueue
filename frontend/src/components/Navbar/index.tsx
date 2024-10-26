import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuth } from '@/hooks/useAuth'
import useRefreshUser from '@/hooks/useRefreshUser'
import NavLinks from '@/components/Navbar/NavLinks'
import MobileNavLinks from '@/components/Navbar/MobileNavLinks'
import UserNav from '@/components/Navbar/UserNav'

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
      <div className='flex items-center'>
        <UserNav loading={loading} isAuthed={isAuthed} handleLogout={handleLogout} />

        <NavLinks loading={loading} isAuthed={isAuthed} handleLogout={handleLogout} />
        <MobileNavLinks loading={loading} isAuthed={isAuthed} handleLogout={handleLogout} />
      </div>
    </div>
  )
}

export default Navbar
