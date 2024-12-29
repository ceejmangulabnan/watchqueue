import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'

const useSearchResults = (searchQuery: string | null, endpoint: string, queryKey: string) => {
  const fetchSearchMovie = async () => {
    const response = await axiosBase.get(endpoint)
    return response.data
  }

  return useQuery({
    queryKey: [queryKey, searchQuery],
    queryFn: fetchSearchMovie,
  })
}

export default useSearchResults
