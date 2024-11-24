import { useAuth } from '@/hooks/useAuth'
import { AxiosError } from 'axios'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'

const useRefreshToken = () => {
  const { setAuth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const refresh = async () => {
    try {
      const response = await axiosPrivate.get('/users/refresh', {
        withCredentials: true
      })

      setAuth(auth => {
        return { ...auth, accessToken: response.data.access_token }
      })

      return response.data.access_token

    } catch (error) {
      if (error instanceof AxiosError && error.status === 401) {
        return null
      }
    }

  }

  return refresh
}

export default useRefreshToken
