import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { useAuth } from '@/hooks/useAuth'
import useRefreshUser from '@/hooks/useRefreshUser'
import NavLinks from '@/components/Navbar/NavLinks'
import UserNav from '@/components/Navbar/UserNav'
import SearchBar from '@/components/SearchBar'
import useRefreshToken from '@/hooks/useRefreshToken'

const Navbar = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth, setAuth } = useAuth()
  const [loading, setLoading] = useState(true)
  const refreshUser = useRefreshUser()
  // const refresh = useRefreshToken()
  const navigate = useNavigate()

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser()
      setLoading(false)
    }

    initAuth()
  }, [])


  const handleLogout = async () => {
    const response = await axiosPrivate.post("/users/logout")
    if (response.status == 200) {
      setAuth({ ...auth, id: null, username: null, accessToken: null })
      navigate(0)
    }
  }

  const isAuthed = auth && !Object.values(auth).includes(null)

  return (
    <div className='z-10 fixed top-0 left-0 right-0 flex items-center justify-center px-10 md:px-20 py-3 text-md font-medium shadow-md bg-white'>
      <div className='w-full 2xl:max-w-[1600px] flex justify-between items-center'>
        <div className='mr-6'>
          <Link to='/'>
            <h1 className='hidden md:block text-xl  md:text-2xl font-semibold'>watchqueue</h1>
            <h1 className='text-2xl md:hidden font-bold'>wq</h1>
          </Link>
        </div>
        <SearchBar />
        <div className='flex items-center'>
          <NavLinks loading={loading} isAuthed={isAuthed} handleLogout={handleLogout} />
          <UserNav loading={loading} isAuthed={isAuthed} handleLogout={handleLogout} auth={auth} />
        </div>

      </div>
    </div>
  )
}

export default Navbar
