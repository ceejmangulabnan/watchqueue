import { useEffect } from "react"
import { useAuth } from "./useAuth"
import { axiosPrivate } from "../api/axios"
import useRefreshToken from "./useRefreshToken"

const useAxiosPrivate = () => {
  const { auth, logout } = useAuth()
  const refresh = useRefreshToken()

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(config => {
      // Add access token to headers
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${auth.accessToken}`
      }
      return config
    }, (error) => Promise.reject(error)
    )

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config
        // Access token is expired and the request hasn't been retried with a new access token
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true
          try {
            const newAccessToken = await refresh()
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            return axiosPrivate(prevRequest)
          } catch (refreshError) {
            // If refresh fails, logout
            logout()
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)

      })

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor)
      axiosPrivate.interceptors.response.eject(responseInterceptor)
    }
  }, [auth, refresh, logout])

  return axiosPrivate
}

export default useAxiosPrivate
