import { useEffect, useState } from "react"
import useAxiosPrivate from "./useAxiosPrivate"
import { useAuth } from "./useAuth"
import { WatchlistItemData } from "../types/WatchlistTypes"


const useFetchWatchlists = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [userWatchlists, setUserWatchlists] = useState<WatchlistItemData[] | null>(null)

  useEffect(() => {
    const fetchWatchlists = async () => {
      const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
      const data = await response.data

      console.log(response)
      if (response.status === 200) {
        setUserWatchlists(data)
      }
    }

    fetchWatchlists()
  }, [])
  return { userWatchlists }
}

export default useFetchWatchlists
