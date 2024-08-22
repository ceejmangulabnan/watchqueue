import axios from "../api/axios"
import { useAuth } from "./useAuth"

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.get('/users/refresh', {
      withCredentials: true
    })

    setAuth(auth => {
      console.log(auth)
      console.log(response.data?.access_token)

      return { ...auth, accessToken: response.data.access_token }

    })
    return response.data.access_token
  }

  return refresh
}

export default useRefreshToken
