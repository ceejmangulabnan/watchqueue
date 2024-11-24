import { useAuth } from '@/hooks/useAuth'
import { AxiosError } from 'axios'
import axios from '@/api/axios'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    try {
      const response = await axios.get('/users/refresh', {
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
