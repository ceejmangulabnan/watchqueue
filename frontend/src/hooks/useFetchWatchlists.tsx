import useAxiosPrivate from "./useAxiosPrivate"
import { useAuth } from "./useAuth"
import { WatchlistItemData } from "../types/WatchlistTypes"
import { useQuery } from "@tanstack/react-query"


const useFetchWatchlists = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()

  const fetchWatchlists = async () => {
    const response = await axiosPrivate.get(`/watchlists/user/${auth.id}`)
    return response.data as WatchlistItemData[]
  }

  const { data: userWatchlists, refetch: refetchUserWatchlists, isError, isLoading, error } = useQuery({ queryKey: ['userWatchlists'], queryFn: fetchWatchlists })

  return { userWatchlists, refetchUserWatchlists, isError, isLoading, error }
}

export default useFetchWatchlists
