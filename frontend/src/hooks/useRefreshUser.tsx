// Responsible for checking refresh token and retrieving data on site refresh or inital render
import useRefreshToken from '@/hooks/useRefreshToken'
import { useAuth } from "./useAuth"
// import axios from "../api/axios"
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { AxiosError } from 'axios'

const useRefreshUser = () => {
  const { setAuth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const refresh = useRefreshToken()

  const refreshUser = async () => {
    try {
      const refreshData = await refresh()
      const user = await axiosPrivate.get('/users/me', {
        headers: {
          Authorization: `Bearer ${refreshData.access_token}`
        }
      })
      const userData = await user.data

      // If fetching is successful, then update the auth context
      setAuth(prevAuth => ({ ...prevAuth, accessToken: refreshData.access_token, id: userData.id, username: userData.username }))

    } catch (error) {
      if (error instanceof AxiosError && error.status === 401)
        return null
    }
  }

  return refreshUser
}

export default useRefreshUser
