// Responsible for checking refresh token and retrieving data on site refresh or inital render
import { useAuth } from "./useAuth"
import axios from "../api/axios"

// Runs first before user even logs in and before the site loads honestly. I think this sf
const useRefreshUser = () => {
  const { auth, setAuth } = useAuth()

  const refreshUser = async () => {
    // Refresh access token and populate auth context on inital render / reload
    try {
      // Does a check for an existing refresh token, if not found returns 401
      // If I get an error inside here, it means that the user hasn't logged in yet and should proceed with rendering the page as if the user isn't authed
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
      setAuth({ ...auth, accessToken: refreshData.access_token, id: userData.id, username: userData.username })

    } catch (error) {
      console.log("Error fetching auth on intial render/reload. Refresh token not found, user must log in", error)
    }
  }

  // This function should be run inside a useLayoutEffect
  return refreshUser
}

export default useRefreshUser
