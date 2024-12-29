import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'

const useMediaDetails = <Media>(mediaId: string | undefined, endpoint: string, queryKey: string) => {
  const fetchMediaDetails = async () => {
    const response = await axiosBase.get(endpoint)
    if (queryKey === 'movieDetails') {
      return response.data as Media
    } else {
      return response.data as Media
    }
  }

  return useQuery({ queryKey: [queryKey, mediaId], queryFn: fetchMediaDetails })
}

export default useMediaDetails
