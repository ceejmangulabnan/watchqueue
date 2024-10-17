// Responsible for checking refresh token and retrieving data on site refresh or inital render
import { useAuth } from "./useAuth"
import axios from "../api/axios"
import { useCallback } from 'react'

const useRefreshUser = () => {
  const { setAuth } = useAuth()

  // UseCallback to handle recreate only if auth state changes
  const refreshUser = useCallback(async () => {
    // Refresh access token and populate auth context on inital render / reload
    // Does a check for an existing refresh token, if not found returns 401
    const refresh = await axios.get('/users/refresh', {
      withCredentials: true
    })
    const refreshData = await refresh.data
    const user = await axios.get('/users/me', {
      headers: {
        Authorization: `Bearer ${refreshData.access_token}`
      }
    })
    const userData = await user.data

    // If fetching is successful, then update the auth context
    setAuth(prevAuth => ({ ...prevAuth, accessToken: refreshData.access_token, id: userData.id, username: userData.username }))

    return userData

  }, [setAuth])

  return refreshUser
}

export default useRefreshUser
