import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'

const useSearchResults = <T,>(searchQuery: string | null, page: string | null, endpoint: string, queryKey: string) => {
  const fetchSearchMovie = async () => {
    const response = await axiosBase.get(endpoint)
    return response.data
  }

  return useQuery<T>({
    queryKey: [queryKey, searchQuery, page],
    queryFn: fetchSearchMovie,
  })
}

export default useSearchResults
