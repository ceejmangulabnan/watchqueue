import { useQuery } from '@tanstack/react-query'
import axiosBase from '@/api/axios'

const useMediaDetails = (mediaId: string | undefined, endpoint: string, queryKey: string) => {
  const fetchMediaDetails = async () => {
    const response = await axiosBase.get(endpoint)
    return response.data
  }

  return useQuery({ queryKey: [queryKey, mediaId], queryFn: fetchMediaDetails })
}

export default useMediaDetails
